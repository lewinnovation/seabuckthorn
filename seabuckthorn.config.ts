export default {
  siteName: "Seabuckthorn",
  locales: ["en", "fr", "de"] as const,
  defaultLocale: "en",
  cms: "none" as "none" | "webiny",
  deploy: "static-only" as
    | "vercel"
    | "netlify"
    | "cloudflare"
    | "aws-s3"
    | "static-only",
  i18nRouting: "hidden-default" as const,
  storybook: true,
  chromatic: false,
  themes: ["light", "dark", "high-contrast"] as const,
  defaultTheme: "light" as const,
} as const;
