import seabuckthorn from "../../seabuckthorn.config.ts";
import {
  defaultLocale,
  localeMeta,
  locales,
  ui,
  type Locale,
  type UiKey,
} from "./ui.ts";
import { resolveLocalizedUrls, getStaticRoutePath } from "../lib/i18n/resolve-path";

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

export function getLocaleSwitchUrls(pathname: string, lang: Locale) {
  const resolved = resolveLocalizedUrls(pathname, lang);
  return resolved.map(({ locale, href }) => ({
    locale,
    label: localeMeta[locale].label,
    href,
  }));
}

export function getAlternateLinks(pathname: string, lang: Locale) {
  return resolveLocalizedUrls(pathname, lang).map(({ locale, href }) => ({
    locale,
    url: href,
  }));
}

export function getNavItems(lang: Locale, t: ReturnType<typeof useTranslations>) {
  return [
    { label: t("nav.home"), href: getStaticRoutePath("home", lang) },
    { label: t("nav.blog"), href: getStaticRoutePath("blog", lang) },
    {
      label: t("nav.about"),
      href: getStaticRoutePath("about", lang),
    },
  ];
}

export const themes = seabuckthorn.themes;
