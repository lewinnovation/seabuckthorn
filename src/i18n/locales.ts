/** Full locale catalog — scaffold prunes entries not in seabuckthorn.config locales. */
export const LOCALE_CATALOG = {
  en: { dir: "ltr" as const, label: "English" },
  fr: { dir: "ltr" as const, label: "Français" },
  de: { dir: "ltr" as const, label: "Deutsch" },
} as const;

export type CatalogLocale = keyof typeof LOCALE_CATALOG;
