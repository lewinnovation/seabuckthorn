import type { CollectionEntry } from "astro:content";
import type { Locale } from "../i18n/ui";

export function getPostSlug(entry: CollectionEntry<"blog">): string {
  const segments = entry.id.replace(/\.(md|mdx)$/, "").split("/");
  return segments.slice(1).join("/") || segments[segments.length - 1]!;
}

export function getPostPath(entry: CollectionEntry<"blog">, locale: Locale): string {
  const slug = getPostSlug(entry);
  if (locale === "en") {
    return `/blog/${slug}/`;
  }
  return `/${locale}/blog/${slug}/`;
}

export function sortPostsByDate<T extends { data: { pubDate: Date } }>(posts: T[]): T[] {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
