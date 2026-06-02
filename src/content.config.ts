import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import seabuckthorn from "../seabuckthorn.config.ts";

const localeEnum = z.enum(
  seabuckthorn.locales as unknown as [string, ...string[]],
);

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  locale: localeEnum,
  /** Links equivalent posts across locales for hreflang and locale switcher */
  translationKey: z.string(),
  /** URL path segment for this locale; falls back to filename when omitted */
  urlSlug: z.string().optional(),
  draft: z.boolean().default(false),
  cover: z
    .object({
      src: z.string(),
      alt: z.string(),
    })
    .optional(),
});

const blog = defineCollection({
  loader: glob({
    base: "./src/content/blog",
    pattern:
      seabuckthorn.cms === "webiny"
        ? "**/__no-mdx-when-webiny__/**"
        : "**/*.{md,mdx}",
  }),
  schema: blogSchema,
});

const pagesSchema = z.object({
  title: z.string(),
  description: z.string(),
  locale: localeEnum,
  translationKey: z.string(),
  urlSlug: z.string().optional(),
  draft: z.boolean().default(false),
});

const pages = defineCollection({
  loader: glob({
    base: "./src/content/pages",
    pattern: "**/*.{md,mdx}",
  }),
  schema: pagesSchema,
});

export const collections = { blog, pages };
