// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import seabuckthorn from "./seabuckthorn.config.ts";

const site = process.env.PUBLIC_SITE_URL ?? "https://example.com";

// https://astro.build/config
export default defineConfig({
  site,
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
      prefixDefaultLocale: false,
    },
    fallback: {
      fr: "en",
      de: "en",
    },
  },
});
