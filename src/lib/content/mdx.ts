import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../../i18n/ui";
import { setBlogTranslationRegistry } from "../i18n/blog-registry";
import { loadBlogMetaFromDisk } from "../i18n/load-blog-meta";
import { loadPagesMetaFromDisk } from "../i18n/load-pages-meta";
import { mergeTranslationRegistry } from "../i18n/blog-registry";
import { getPostSlugFromId } from "../blog";
import { getActiveMarketId } from "./market";
import type { BlogPost, ContentSource } from "./types";

let registrySynced = false;

function syncBlogRegistryFromDisk(): void {
  if (registrySynced) return;
  const marketId = getActiveMarketId();
  const meta = loadBlogMetaFromDisk().filter((m) => {
    if (m.draft) return false;
    const isMarket = m.id.includes("/markets/");
    if (isMarket) return marketId ? m.id.includes(`/markets/${marketId}/`) : false;
    if (marketId) {
      const hasOverride = loadBlogMetaFromDisk().some(
        (o) =>
          !o.draft &&
          o.translationKey === m.translationKey &&
          o.locale === m.locale &&
          o.id.includes(`/markets/${marketId}/`),
      );
      return !hasOverride;
    }
    return true;
  });
  const byKey = new Map<string, Partial<Record<Locale, string>>>();
  for (const m of meta) {
    if (!byKey.has(m.translationKey)) byKey.set(m.translationKey, {});
    byKey.get(m.translationKey)![m.locale] = m.slug;
  }
  const blogEntries = [...byKey.entries()].map(([translationKey, slugs]) => ({
    translationKey,
    slugs,
  }));
  setBlogTranslationRegistry(blogEntries);

  const pagesMeta = loadPagesMetaFromDisk().filter((m) => !m.draft);
  const pagesByKey = new Map<string, Partial<Record<Locale, string>>>();
  for (const m of pagesMeta) {
    if (!pagesByKey.has(m.translationKey)) pagesByKey.set(m.translationKey, {});
    pagesByKey.get(m.translationKey)![m.locale] = m.slug;
  }
  mergeTranslationRegistry(
    [...pagesByKey.entries()].map(([translationKey, slugs]) => ({
      translationKey,
      slugs,
    })),
  );

  registrySynced = true;
}

function isMarketEntry(id: string): boolean {
  return id.includes("/markets/");
}

function marketIdFromEntryId(id: string): string | undefined {
  const match = id.match(/\/markets\/([^/]+)\//);
  return match?.[1];
}

function mapMdxEntry(entry: CollectionEntry<"blog">): BlogPost {
  const slug = entry.data.urlSlug ?? getPostSlugFromId(entry.id);
  return {
    slug,
    translationKey: entry.data.translationKey,
    locale: entry.data.locale as Locale,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate,
    draft: entry.data.draft,
    cover: entry.data.cover,
    body: "",
    bodyFormat: "mdx",
    mdxEntry: entry,
  };
}

function selectEntriesForLocale(
  entries: CollectionEntry<"blog">[],
  locale: Locale,
  marketId?: string,
): CollectionEntry<"blog">[] {
  const localeEntries = entries.filter((e) => e.data.locale === locale && !e.data.draft);
  const byKey = new Map<string, CollectionEntry<"blog">[]>();

  for (const entry of localeEntries) {
    const key = entry.data.translationKey;
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key)!.push(entry);
  }

  const chosen: CollectionEntry<"blog">[] = [];

  for (const [translationKey, group] of byKey) {
    const override = marketId
      ? group.find(
          (e) =>
            isMarketEntry(e.id) && marketIdFromEntryId(e.id) === marketId,
        )
      : undefined;
    const base = group.find((e) => !isMarketEntry(e.id));

    if (override) {
      console.info(
        `[seabuckthorn:market] override translationKey="${translationKey}" id="${override.id}"`,
      );
      chosen.push(override);
    } else if (base) {
      if (marketId) {
        console.info(
          `[seabuckthorn:market] fallback translationKey="${translationKey}" id="${base.id}"`,
        );
      }
      chosen.push(base);
    }
  }

  return chosen;
}

export class MdxBlogSource implements ContentSource {
  async list(locale: Locale): Promise<BlogPost[]> {
    syncBlogRegistryFromDisk();
    const marketId = getActiveMarketId();
    const entries = await getCollection("blog");
    const selected = selectEntriesForLocale(entries, locale, marketId);
    return selected.map(mapMdxEntry);
  }

  async getBySlug(locale: Locale, slug: string): Promise<BlogPost | null> {
    const posts = await this.list(locale);
    return posts.find((post) => post.slug === slug) ?? null;
  }
}

export function createMdxBlogSource(): ContentSource {
  return new MdxBlogSource();
}
