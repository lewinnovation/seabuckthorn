import type { Locale } from "./ui";

/**
 * Logical route keys for static pages (non-blog).
 * Values are path segments after locale prefix, with trailing slash.
 */
export const staticRouteKeys = {
  home: "",
  blog: "blog",
  about: "about",
} as const;

export type StaticRouteKey = keyof typeof staticRouteKeys;

/**
 * Per-locale URL paths for static routes (relative to locale root).
 * Empty string for home = locale root `/` or `/fr/`.
 */
export const routeSlugMap: Record<
  StaticRouteKey,
  Partial<Record<Locale, string>>
> = {
  home: { en: "", fr: "", de: "" },
  blog: { en: "blog", fr: "actualites", de: "blog" },
  about: { en: "about", fr: "a-propos", de: "ueber-uns" },
};
