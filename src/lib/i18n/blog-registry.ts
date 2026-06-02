import type { Locale } from "../../i18n/ui";

export type BlogTranslationEntry = {
  translationKey: string;
  slugs: Partial<Record<Locale, string>>;
};

let registry = new Map<string, Partial<Record<Locale, string>>>();

export function setBlogTranslationRegistry(entries: BlogTranslationEntry[]): void {
  registry = new Map(entries.map((e) => [e.translationKey, { ...e.slugs }]));
}

export function mergeTranslationRegistry(entries: BlogTranslationEntry[]): void {
  for (const e of entries) {
    const existing = registry.get(e.translationKey) ?? {};
    registry.set(e.translationKey, { ...existing, ...e.slugs });
  }
}

export function getBlogTranslationRegistry(): ReadonlyMap<
  string,
  Partial<Record<Locale, string>>
> {
  return registry;
}

export function getBlogSlugForLocale(
  translationKey: string,
  locale: Locale,
): string | undefined {
  return registry.get(translationKey)?.[locale];
}

export function findTranslationKeyBySlug(
  locale: Locale,
  slug: string,
): string | undefined {
  for (const [key, slugs] of registry) {
    if (slugs[locale] === slug) return key;
  }
  return undefined;
}

export function clearBlogTranslationRegistry(): void {
  registry = new Map();
}
