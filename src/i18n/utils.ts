import { getAbsoluteLocaleUrl } from "astro:i18n";
import seabuckthorn from "../../seabuckthorn.config.ts";
import {
  defaultLocale,
  localeMeta,
  locales,
  ui,
  type Locale,
  type UiKey,
} from "./ui.ts";

export { defaultLocale, localeMeta, locales, ui, type Locale, type UiKey };

export function getLangFromUrl(url: URL): Locale {
  const [, maybeLocale] = url.pathname.split("/");
  if (maybeLocale && locales.includes(maybeLocale as Locale)) {
    return maybeLocale as Locale;
  }
  return defaultLocale;
}

export function useTranslations(lang: Locale) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLocale][key];
  };
}

export function getLocaleDir(lang: Locale): "ltr" | "rtl" {
  return localeMeta[lang].dir;
}

const prefixDefaultLocale = seabuckthorn.i18nRouting === "prefix";

export function getPathWithoutLocale(pathname: string, lang: Locale): string {
  if (!prefixDefaultLocale && lang === defaultLocale) {
    return pathname || "/";
  }
  const prefix = `/${lang}`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length) || "/";
  }
  return pathname;
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!prefixDefaultLocale && locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized;
  }
  if (normalized === "/") {
    return `/${locale}/`;
  }
  return `/${locale}${normalized}`;
}

export function getLocaleSwitchUrls(currentPath: string) {
  return locales.map((locale) => ({
    locale,
    label: localeMeta[locale].label,
    href: getAbsoluteLocaleUrl(locale, currentPath),
  }));
}

export function getAlternateLinks(pathname: string, lang: Locale) {
  const currentPath = getPathWithoutLocale(pathname, lang);
  return locales.map((locale) => ({
    locale,
    url: getAbsoluteLocaleUrl(locale, currentPath),
  }));
}

export function getNavItems(lang: Locale, t: ReturnType<typeof useTranslations>) {
  return [
    { label: t("nav.home"), href: localizedPath(lang, "/") },
    { label: t("nav.blog"), href: localizedPath(lang, "/blog/") },
    { label: t("nav.about"), href: localizedPath(lang, "/#about") },
  ];
}

export const themes = seabuckthorn.themes;
