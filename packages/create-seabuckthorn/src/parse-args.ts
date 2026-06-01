import path from "node:path";
import {
  ALL_LOCALES,
  ALL_THEMES,
  CMS_OPTIONS,
  DEPLOY_OPTIONS,
  I18N_ROUTING_OPTIONS,
  type CatalogLocale,
  type CmsOption,
  type DeployOption,
  type I18nRouting,
  type ThemeId,
} from "./constants.js";
import type { CliFlags, ScaffoldOptions } from "./types.js";

function parseList<T extends string>(value: string, allowed: readonly T[]): T[] {
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const invalid = items.filter((i) => !allowed.includes(i as T));
  if (invalid.length) {
    throw new Error(`Invalid values: ${invalid.join(", ")}. Allowed: ${allowed.join(", ")}`);
  }
  return items as T[];
}

export function parseArgv(argv: string[]): { targetDir?: string; flags: CliFlags } {
  const flags: CliFlags = {};
  const positional: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === "--help" || arg === "-h") {
      flags.help = true;
    } else if (arg === "--yes" || arg === "-y") {
      flags.yes = true;
    } else if (arg === "--no-install") {
      flags.noInstall = true;
    } else if (arg === "--install") {
      flags.install = true;
    } else if (arg === "--no-git") {
      flags.noGit = true;
    } else if (arg === "--git") {
      flags.git = true;
    } else if (arg.startsWith("--") && argv[i + 1] && !argv[i + 1]!.startsWith("-")) {
      const key = arg.slice(2);
      const val = argv[++i]!;
      switch (key) {
        case "name":
          flags.name = val;
          break;
        case "site":
          flags.site = val;
          break;
        case "locales":
          flags.locales = val;
          break;
        case "cms":
          flags.cms = val;
          break;
        case "deploy":
          flags.deploy = val;
          break;
        case "themes":
          flags.themes = val;
          break;
        case "i18n-routing":
          flags.i18nRouting = val;
          break;
        case "chromatic-token":
          flags.chromaticToken = val;
          break;
        case "template":
          flags.template = val;
          break;
      }
    } else if (!arg.startsWith("-")) {
      positional.push(arg);
    }
  }

  return { targetDir: positional[0], flags };
}

export function flagsToOptions(
  targetDir: string,
  flags: CliFlags,
  interactive: Partial<ScaffoldOptions>,
): ScaffoldOptions {
  const dirName = path.basename(path.resolve(targetDir));
  const projectName = flags.name ?? interactive.projectName ?? dirName;
  const siteName = interactive.siteName ?? projectName;
  const siteUrl = flags.site ?? interactive.siteUrl ?? "https://example.com";

  const locales =
    flags.locales != null
      ? parseList(flags.locales, ALL_LOCALES)
      : (interactive.locales ?? ["en"]);

  if (locales.length === 0) {
    throw new Error("At least one locale is required.");
  }

  const defaultLocale = locales.includes("en" as CatalogLocale)
    ? ("en" as CatalogLocale)
    : locales[0]!;

  const cms = (flags.cms ?? interactive.cms ?? "none") as CmsOption;
  if (!CMS_OPTIONS.includes(cms)) {
    throw new Error(`Invalid --cms. Allowed: ${CMS_OPTIONS.join(", ")}`);
  }

  const deploy = (flags.deploy ?? interactive.deploy ?? "static-only") as DeployOption;
  if (!DEPLOY_OPTIONS.includes(deploy)) {
    throw new Error(`Invalid --deploy. Allowed: ${DEPLOY_OPTIONS.join(", ")}`);
  }

  const themes =
    flags.themes != null
      ? parseList(flags.themes, ALL_THEMES)
      : (interactive.themes ?? [...ALL_THEMES]);

  if (themes.length === 0) {
    throw new Error("At least one theme is required.");
  }

  const i18nRouting = (flags.i18nRouting ??
    interactive.i18nRouting ??
    "hidden-default") as I18nRouting;
  if (!I18N_ROUTING_OPTIONS.includes(i18nRouting)) {
    throw new Error(`Invalid --i18n-routing. Allowed: ${I18N_ROUTING_OPTIONS.join(", ")}`);
  }

  const install = flags.noInstall ? false : (flags.install ?? interactive.install ?? true);
  const git = flags.noGit ? false : (flags.git ?? interactive.git ?? true);

  return {
    projectDir: path.resolve(targetDir),
    projectName,
    siteName,
    siteUrl,
    locales,
    defaultLocale,
    cms,
    deploy,
    themes,
    defaultTheme: themes.includes("light") ? "light" : themes[0]!,
    i18nRouting,
    chromaticToken: flags.chromaticToken ?? interactive.chromaticToken,
    install,
    git,
    yes: flags.yes ?? false,
  };
}

export const HELP_TEXT = `
create-seabuckthorn — Scaffold a Seabuckthorn Astro site

Usage:
  pnpm create seabuckthorn [directory] [options]

Options:
  -h, --help              Show help
  -y, --yes               Skip prompts (use defaults / flags)
  --name <name>           Site display name (default: directory name)
  --site <url>            Production site URL (default: https://example.com)
  --locales <list>        Comma-separated locales: en,fr,de (default: en)
  --cms <none|webiny>     CMS mode (default: none)
  --deploy <profile>      static-only|vercel|netlify|cloudflare|aws-s3
  --themes <list>         light,dark,high-contrast
  --i18n-routing <mode>   hidden-default|prefix
  --chromatic-token <t>   Chromatic project token (optional)
  --install / --no-install
  --git / --no-git

Examples:
  pnpm create seabuckthorn my-site
  pnpm create seabuckthorn my-site -- --locales en,fr --deploy vercel -y
`.trim();
