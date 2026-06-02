import seabuckthorn from "../../../seabuckthorn.config.ts";
import { defaultLocale, type Locale } from "../../i18n/ui";
import {
  routeSlugMap,
  staticRouteKeys,
  type StaticRouteKey,
} from "../../i18n/routes";
import {
  findTranslationKeyBySlug,
  getBlogSlugForLocale,
} from "./blog-registry";

const prefixDefaultLocale = seabuckthorn.i18nRouting === "prefix";

function localeRoot(locale: Locale): string {
  if (!prefixDefaultLocale && locale === defaultLocale) return "";
  return `/${locale}`;
}

function joinPath(root: string, segment: string): string {
  if (segment.startsWith("#")) {
    const base = root || "/";
    return base.endsWith("/") ? `${base.slice(0, -1)}${segment}` : `${base}${segment}`;
  }
  if (!segment) {
    return root ? `${root}/` : "/";
  }
  const path = `${root}/${segment}`.replace(/\/+/g, "/");
  return path.endsWith("/") ? path : `${path}/`;
}

export function getStaticRoutePath(
  routeKey: StaticRouteKey,
  locale: Locale,
): string {
  const segment =
    routeSlugMap[routeKey][locale] ??
    routeSlugMap[routeKey][defaultLocale] ??
    staticRouteKeys[routeKey];
  return joinPath(localeRoot(locale), segment);
}

export function getBlogPostPath(locale: Locale, slug: string): string {
  const blogSegment =
    routeSlugMap.blog[locale] ??
    routeSlugMap.blog[defaultLocale] ??
    staticRouteKeys.blog;
  return joinPath(localeRoot(locale), `${blogSegment}/${slug}`);
}

export function getPagePath(locale: Locale, slug: string): string {
  return joinPath(localeRoot(locale), slug);
}

export function resolveStaticRouteKey(
  pathname: string,
  locale: Locale,
): StaticRouteKey | null {
  const withoutLocale = stripLocalePrefix(pathname, locale);

  if (withoutLocale === "/" || withoutLocale === "") return "home";

  for (const key of Object.keys(staticRouteKeys) as StaticRouteKey[]) {
    if (key === "home") continue;
    const segment = routeSlugMap[key][locale] ?? staticRouteKeys[key];
    if (segment.startsWith("#")) {
      if (withoutLocale.endsWith(segment) || withoutLocale.includes(segment)) {
        return key;
      }
      continue;
    }
    const expected = `/${segment}/`;
    if (withoutLocale === expected || withoutLocale.startsWith(expected)) {
      return key;
    }
  }
  return null;
}

export function resolveBlogSlugFromPath(
  pathname: string,
  locale: Locale,
): string | null {
  const withoutLocale = stripLocalePrefix(pathname, locale);
  const blogSegment =
    routeSlugMap.blog[locale] ??
    routeSlugMap.blog[defaultLocale] ??
    staticRouteKeys.blog;
  const prefix = `/${blogSegment}/`;
  if (!withoutLocale.startsWith(prefix)) return null;
  const rest = withoutLocale.slice(prefix.length).replace(/\/$/, "");
  if (!rest || rest.includes("/")) return null;
  return rest;
}

function resolvePageSlugFromPath(
  pathname: string,
  locale: Locale,
): string | null {
  const withoutLocale = stripLocalePrefix(pathname, locale);
  const segment = withoutLocale.replace(/^\/|\/$/g, "");
  if (!segment || segment.includes("/")) return null;
  if (resolveStaticRouteKey(pathname, locale)) return null;
  if (resolveBlogSlugFromPath(pathname, locale)) return null;
  return segment;
}

export function resolveLocalizedUrls(
  pathname: string,
  currentLocale: Locale,
): { locale: Locale; href: string }[] {
  const pageSlug = resolvePageSlugFromPath(pathname, currentLocale);
  if (pageSlug) {
    const translationKey = findTranslationKeyBySlug(currentLocale, pageSlug);
    if (translationKey) {
      return seabuckthorn.locales.map((locale) => {
        const slug = getBlogSlugForLocale(translationKey, locale);
        const href = slug ? getPagePath(locale, slug) : getStaticRoutePath("home", locale);
        return { locale, href };
      });
    }
  }

  const blogSlug = resolveBlogSlugFromPath(pathname, currentLocale);
  if (blogSlug) {
    const translationKey = findTranslationKeyBySlug(currentLocale, blogSlug);
    if (translationKey) {
      return seabuckthorn.locales.map((locale) => {
        const slug = getBlogSlugForLocale(translationKey, locale);
        const href = slug
          ? getBlogPostPath(locale, slug)
          : getStaticRoutePath("blog", locale);
        return { locale, href };
      });
    }
  }

  const staticKey = resolveStaticRouteKey(pathname, currentLocale);
  if (staticKey) {
    return seabuckthorn.locales.map((locale) => ({
      locale,
      href: getStaticRoutePath(staticKey, locale),
    }));
  }

  const logical = stripLocalePrefix(pathname, currentLocale);
  return seabuckthorn.locales.map((locale) => ({
    locale,
    href: joinPath(localeRoot(locale), logical.replace(/^\//, "")),
  }));
}

function stripLocalePrefix(pathname: string, locale: Locale): string {
  if (!prefixDefaultLocale && locale === defaultLocale) {
    return pathname.endsWith("/") ? pathname : `${pathname}/`;
  }
  const prefix = `/${locale}`;
  if (pathname.startsWith(prefix)) {
    const rest = pathname.slice(prefix.length) || "/";
    return rest.endsWith("/") ? rest : `${rest}/`;
  }
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}
