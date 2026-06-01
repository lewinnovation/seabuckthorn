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

export const collections = { blog };
