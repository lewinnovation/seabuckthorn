import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "../../i18n/ui";
import { getPostSlugFromId } from "../blog";
import type { BlogPost, ContentSource } from "./types";

function mapMdxEntry(entry: CollectionEntry<"blog">): BlogPost {
  return {
    slug: getPostSlugFromId(entry.id),
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

export class MdxBlogSource implements ContentSource {
  async list(locale: Locale): Promise<BlogPost[]> {
    const entries = await getCollection(
      "blog",
      ({ data }) => !data.draft && data.locale === locale,
    );
    return entries.map(mapMdxEntry);
  }

  async getBySlug(locale: Locale, slug: string): Promise<BlogPost | null> {
    const posts = await this.list(locale);
    return posts.find((post) => post.slug === slug) ?? null;
  }
}

export function createMdxBlogSource(): ContentSource {
  return new MdxBlogSource();
}
