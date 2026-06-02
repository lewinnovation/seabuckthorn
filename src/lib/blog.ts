import type { BlogPost } from "./content/types";
import type { Locale } from "../i18n/ui";
import { getBlogPostPath } from "./i18n/resolve-path";

export function getPostSlugFromId(id: string): string {
  const segments = id.replace(/\.(md|mdx)$/, "").split("/");
  const withoutMarkets = segments.filter((s) => s !== "markets");
  const localeIdx = withoutMarkets.findIndex((s) =>
    ["en", "fr", "de"].includes(s),
  );
  if (localeIdx >= 0) {
    return withoutMarkets.slice(localeIdx + 1).join("/") || withoutMarkets.at(-1)!;
  }
  return segments.slice(1).join("/") || segments[segments.length - 1]!;
}

/** @deprecated Use getPostSlugFromId or post.slug from BlogPost */
export function getPostSlug(entry: { id: string }): string {
  return getPostSlugFromId(entry.id);
}

export function getPostPath(post: BlogPost, locale: Locale): string {
  return getBlogPostPath(locale, post.slug);
}

export function sortPostsByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
