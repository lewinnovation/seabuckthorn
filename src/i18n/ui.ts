import seabuckthorn from "../../seabuckthorn.config.ts";
import { LOCALE_CATALOG } from "./locales.ts";
import { uiStrings } from "./ui-strings.ts";

export type Locale = (typeof seabuckthorn.locales)[number];
export type Theme = (typeof seabuckthorn.themes)[number];

export const locales = seabuckthorn.locales;
export const defaultLocale = seabuckthorn.defaultLocale;

export const localeMeta = Object.fromEntries(
  seabuckthorn.locales.map((locale) => [locale, LOCALE_CATALOG[locale]]),
) as Record<Locale, (typeof LOCALE_CATALOG)[Locale]>;

export const ui = Object.fromEntries(
  seabuckthorn.locales.map((locale) => [locale, uiStrings[locale]]),
) as {
  [K in Locale]: (typeof uiStrings)[K];
};

export type UiKey = keyof (typeof ui)[typeof defaultLocale];
