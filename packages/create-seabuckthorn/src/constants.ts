import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const PACKAGE_ROOT = path.resolve(__dirname, "..");
export const TEMPLATE_DIR = path.join(PACKAGE_ROOT, "template");
export const SCAFFOLD_DIR = path.join(PACKAGE_ROOT, "scaffold");

export const ALL_LOCALES = ["en", "fr", "de"] as const;
export type CatalogLocale = (typeof ALL_LOCALES)[number];

export const ALL_THEMES = ["light", "dark", "high-contrast"] as const;
export type ThemeId = (typeof ALL_THEMES)[number];

export const CMS_OPTIONS = ["none", "webiny"] as const;
export type CmsOption = (typeof CMS_OPTIONS)[number];

export const DEPLOY_OPTIONS = [
  "static-only",
  "vercel",
  "netlify",
  "cloudflare",
  "aws-s3",
] as const;
export type DeployOption = (typeof DEPLOY_OPTIONS)[number];

export const I18N_ROUTING_OPTIONS = ["hidden-default", "prefix"] as const;
export type I18nRouting = (typeof I18N_ROUTING_OPTIONS)[number];

export const DEPLOY_README: Record<DeployOption, string> = {
  "static-only": "Upload `dist/` to any static host — see [docs/deploy.md](docs/deploy.md).",
  vercel: "Copy [`deploy/vercel.json`](deploy/vercel.json) to the repo root or match settings in the Vercel dashboard.",
  netlify: "Copy [`deploy/netlify.toml`](deploy/netlify.toml) to the repo root.",
  cloudflare:
    "Use [`deploy/cloudflare/wrangler.jsonc`](deploy/cloudflare/wrangler.jsonc) with `pnpm deploy:cloudflare`.",
  "aws-s3":
    "Use [`deploy/aws/sync.sh`](deploy/aws/sync.sh) with `pnpm deploy:aws` and configure GitHub OIDC secrets.",
};
