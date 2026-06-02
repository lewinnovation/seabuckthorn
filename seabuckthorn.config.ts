export default {
  siteName: "Seabuckthorn",
  locales: ["en", "fr", "de"] as const,
  defaultLocale: "en",
  /** Optional regulatory markets sharing a locale (set MARKET=id at build time) */
  markets: [{ id: "at", locale: "de" }] as const,
  defaultMarket: undefined as string | undefined,
  cms: "none" as "none" | "webiny",
  deploy: "static-only" as
    | "vercel"
    | "netlify"
    | "cloudflare"
    | "aws-s3"
    | "static-only",
  i18nRouting: "hidden-default" as "prefix" | "hidden-default",
  storybook: true,
  chromatic: false,
  themes: ["light", "dark", "high-contrast"] as const,
  defaultTheme: "light" as const,
  brand: {
    primary: "#1d4ed8",
    secondary: "#0f172a",
    accent: "#2563eb",
    fontFamily: "system-ui, sans-serif",
    logo: "/favicon.svg",
    favicon: "/favicon.ico",
  },
} as const;
