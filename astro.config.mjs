// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import seabuckthorn from "./seabuckthorn.config.ts";

const site = process.env.PUBLIC_SITE_URL ?? "https://example.com";
/** Set for GitHub Pages project sites, e.g. ASTRO_BASE=/seabuckthorn/ */
const base = process.env.ASTRO_BASE ?? "/";

// https://astro.build/config
export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), react(), sitemap()],
  i18n: {
    locales: [...seabuckthorn.locales],
    defaultLocale: seabuckthorn.defaultLocale,
    routing: {
      prefixDefaultLocale: seabuckthorn.i18nRouting === "prefix",
    },
    fallback: Object.fromEntries(
      seabuckthorn.locales
        .filter((locale) => locale !== seabuckthorn.defaultLocale)
        .map((locale) => [locale, seabuckthorn.defaultLocale]),
    ),
  },
});
