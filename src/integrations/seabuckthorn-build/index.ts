import type { AstroIntegration } from "astro";
import seabuckthorn from "../../../seabuckthorn.config.ts";
import { defaultLocale, locales, ui, type Locale, type UiKey } from "../../i18n/ui";
import {
  mergeTranslationRegistry,
  setBlogTranslationRegistry,
} from "../../lib/i18n/blog-registry";
import { loadBlogMetaFromDisk } from "../../lib/i18n/load-blog-meta";
import { loadPagesMetaFromDisk } from "../../lib/i18n/load-pages-meta";

function validateBlogTranslations(
  entries: {
    id: string;
    data: {
      locale: string;
      translationKey: string;
      urlSlug?: string;
      draft?: boolean;
    };
  }[],
): void {
  const byLocale = new Map<Locale, Map<string, string>>();
  const byKey = new Map<string, Partial<Record<Locale, string>>>();

  const marketId = process.env.MARKET ?? process.env.ASTRO_MARKET;

  for (const entry of entries) {
    if (entry.data.draft) continue;
    const locale = entry.data.locale as Locale;
    const isMarket = entry.id.includes("/markets/");
    if (isMarket && (!marketId || !entry.id.includes(`/markets/${marketId}/`))) {
      continue;
    }
    const slug =
      entry.data.urlSlug ??
      entry.id.split("/").pop()?.replace(/\.mdx?$/, "") ??
      "";
    const key = entry.data.translationKey;

    if (!byKey.has(key)) byKey.set(key, {});
    const group = byKey.get(key)!;

    if (group[locale] && !isMarket) {
      const hasOverride = entries.some(
        (e) =>
          !e.data.draft &&
          e.data.translationKey === key &&
          e.data.locale === locale &&
          e.id.includes("/markets/") &&
          marketId &&
          e.id.includes(`/markets/${marketId}/`),
      );
      if (!hasOverride) {
        throw new Error(
          `[seabuckthorn] Duplicate translationKey "${key}" for locale "${locale}"`,
        );
      }
      continue;
    }

    if (isMarket && group[locale] && marketId) {
      group[locale] = slug;
      continue;
    }

    if (!byLocale.has(locale)) byLocale.set(locale, new Map());
    const localeSlugs = byLocale.get(locale)!;
    if (localeSlugs.has(slug)) {
      throw new Error(
        `[seabuckthorn] Duplicate blog slug "${slug}" for locale "${locale}"`,
      );
    }
    localeSlugs.set(slug, entry.id);

    if (!group[locale] || isMarket) {
      group[locale] = slug;
    }
  }

  for (const [key, slugs] of byKey) {
    for (const locale of seabuckthorn.locales) {
      if (!slugs[locale]) {
        throw new Error(
          `[seabuckthorn] translationKey "${key}" missing a post for locale "${locale}"`,
        );
      }
    }
  }

  const registryEntries = [...byKey.entries()].map(([translationKey, slugs]) => ({
    translationKey,
    slugs,
  }));
  setBlogTranslationRegistry(registryEntries);
}

function validatePagesTranslations(
  entries: {
    locale: string;
    translationKey: string;
    slug: string;
    draft: boolean;
  }[],
): void {
  const byKey = new Map<string, Partial<Record<Locale, string>>>();

  for (const entry of entries) {
    if (entry.draft) continue;
    const locale = entry.locale as Locale;
    const key = entry.translationKey;
    if (!byKey.has(key)) byKey.set(key, {});
    const group = byKey.get(key)!;
    if (group[locale]) {
      throw new Error(
        `[seabuckthorn] Duplicate pages translationKey "${key}" for locale "${locale}"`,
      );
    }
    group[locale] = entry.slug;
  }

  for (const [key, slugs] of byKey) {
    for (const locale of seabuckthorn.locales) {
      if (!slugs[locale]) {
        throw new Error(
          `[seabuckthorn] pages translationKey "${key}" missing locale "${locale}"`,
        );
      }
    }
  }

  mergeTranslationRegistry(
    [...byKey.entries()].map(([translationKey, slugs]) => ({
      translationKey,
      slugs,
    })),
  );
}

function validateUiStrings(): void {
  const referenceKeys = Object.keys(ui[defaultLocale]) as UiKey[];
  for (const locale of locales) {
    for (const key of referenceKeys) {
      if (ui[locale][key] === undefined) {
        throw new Error(
          `[seabuckthorn] Missing ui string "${key}" for locale "${locale}"`,
        );
      }
    }
  }
}

function validateBrandConfig(): void {
  const brand = (seabuckthorn as { brand?: Record<string, string> }).brand;
  if (!brand) return;

  const hex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  for (const [name, value] of Object.entries(brand)) {
    if (
      typeof value === "string" &&
      name !== "fontFamily" &&
      name !== "logo" &&
      name !== "favicon"
    ) {
      if (!hex.test(value)) {
        throw new Error(`[seabuckthorn] Invalid brand color "${name}": ${value}`);
      }
    }
  }
}

async function runBuildChecks(): Promise<void> {
  validateUiStrings();
  validateBrandConfig();

  if (seabuckthorn.cms === "webiny") return;

  const meta = loadBlogMetaFromDisk();
  validateBlogTranslations(
    meta.map((m) => ({
      id: m.id,
      data: {
        locale: m.locale,
        translationKey: m.translationKey,
        urlSlug: m.slug,
        draft: m.draft,
      },
    })),
  );

  const pagesMeta = loadPagesMetaFromDisk();
  validatePagesTranslations(pagesMeta);
}

function seabuckthornVitePlugin() {
  let ran = false;
  return {
    name: "seabuckthorn-build",
    enforce: "pre" as const,
    async buildStart() {
      if (ran) return;
      ran = true;
      await runBuildChecks();
    },
  };
}

export function seabuckthornBuildIntegration(): AstroIntegration {
  return {
    name: "seabuckthorn-build",
    hooks: {
      "astro:config:setup": ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [seabuckthornVitePlugin()],
          },
        });
      },
    },
  };
}
