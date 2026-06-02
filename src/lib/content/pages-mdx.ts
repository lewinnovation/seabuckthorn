import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../../i18n/ui";
import { getPagePath as resolvePagePath } from "../i18n/resolve-path";
import { getPostSlugFromId } from "../blog";

export interface SitePage {
  slug: string;
  translationKey: string;
  locale: Locale;
  title: string;
  description: string;
  mdxEntry: CollectionEntry<"pages">;
}

function mapPageEntry(entry: CollectionEntry<"pages">): SitePage {
  return {
    slug: entry.data.urlSlug ?? getPostSlugFromId(entry.id),
    translationKey: entry.data.translationKey,
    locale: entry.data.locale as Locale,
    title: entry.data.title,
    description: entry.data.description,
    mdxEntry: entry,
  };
}

export async function listPages(locale: Locale): Promise<SitePage[]> {
  const entries = await getCollection(
    "pages",
    ({ data }) => !data.draft && data.locale === locale,
  );
  return entries.map(mapPageEntry);
}

export function getPagePath(page: SitePage, locale: Locale): string {
  return resolvePagePath(locale, page.slug);
}
