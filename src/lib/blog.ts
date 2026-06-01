import type { BlogPost } from "./content/types";
import type { Locale } from "../i18n/ui";

export function getPostSlugFromId(id: string): string {
  const segments = id.replace(/\.(md|mdx)$/, "").split("/");
  return segments.slice(1).join("/") || segments[segments.length - 1]!;
}

/** @deprecated Use getPostSlugFromId or post.slug from BlogPost */
export function getPostSlug(entry: { id: string }): string {
  return getPostSlugFromId(entry.id);
}

export function getPostPath(post: BlogPost, locale: Locale): string {
  if (locale === "en") {
    return `/blog/${post.slug}/`;
  }
  return `/${locale}/blog/${post.slug}/`;
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
