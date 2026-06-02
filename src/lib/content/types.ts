import type { CollectionEntry } from "astro:content";
import type { Locale } from "../../i18n/ui";

export interface BlogPost {
  slug: string;
  translationKey: string;
  locale: Locale;
  title: string;
  description: string;
  pubDate: Date;
  draft: boolean;
  cover?: { src: string; alt: string };
  body: string;
  bodyFormat: "mdx" | "markdown";
  mdxEntry?: CollectionEntry<"blog">;
}

export interface ContentSource {
  list(locale: Locale): Promise<BlogPost[]>;
  getBySlug(locale: Locale, slug: string): Promise<BlogPost | null>;
}
