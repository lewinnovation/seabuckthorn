import * as p from "@clack/prompts";
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
import type { ScaffoldOptions } from "./types.js";

function isCancel<T>(value: T | symbol): value is symbol {
  return p.isCancel(value);
}

export async function runPrompts(
  targetDir: string,
  dirName: string,
): Promise<Partial<ScaffoldOptions>> {
  p.intro("create-seabuckthorn");

  const projectName = await p.text({
    message: "Project / site name",
    initialValue: dirName,
    validate: (v) => (v?.trim() ? undefined : "Name is required"),
  });
  if (isCancel(projectName)) process.exit(0);

  const siteUrl = await p.text({
    message: "Production site URL",
    initialValue: "https://example.com",
    validate: (v) => (v?.trim() ? undefined : "URL is required"),
  });
  if (isCancel(siteUrl)) process.exit(0);

  const locales = await p.multiselect({
    message: "Locales",
    options: ALL_LOCALES.map((l) => ({ value: l, label: l })),
    initialValues: ["en"] as CatalogLocale[],
    required: true,
  });
  if (isCancel(locales)) process.exit(0);

  const cms = await p.select({
    message: "CMS",
    options: CMS_OPTIONS.map((c) => ({
      value: c,
      label: c === "none" ? "None (MDX collections)" : "Webiny Headless CMS",
    })),
    initialValue: "none" as CmsOption,
  });
  if (isCancel(cms)) process.exit(0);

  const deploy = await p.select({
    message: "Deploy profile",
    options: DEPLOY_OPTIONS.map((d) => ({ value: d, label: d })),
    initialValue: "static-only" as DeployOption,
  });
  if (isCancel(deploy)) process.exit(0);

  const themes = await p.multiselect({
    message: "Themes",
    options: ALL_THEMES.map((t) => ({ value: t, label: t })),
    initialValues: [...ALL_THEMES] as ThemeId[],
    required: true,
  });
  if (isCancel(themes)) process.exit(0);

  const i18nRouting = await p.select({
    message: "i18n URL routing",
    options: [
      {
        value: "hidden-default" as I18nRouting,
        label: "Hidden default (/about vs /fr/about)",
      },
      {
        value: "prefix" as I18nRouting,
        label: "Prefix all locales (/en/about, /fr/about)",
      },
    ],
    initialValue: "hidden-default" as I18nRouting,
  });
  if (isCancel(i18nRouting)) process.exit(0);

  const chromaticToken = await p.text({
    message: "Chromatic project token (optional)",
    placeholder: "chpt_…",
  });
  if (isCancel(chromaticToken)) process.exit(0);

  const install = await p.confirm({
    message: "Install dependencies with pnpm?",
    initialValue: true,
  });
  if (isCancel(install)) process.exit(0);

  const git = await p.confirm({
    message: "Initialize git repository?",
    initialValue: true,
  });
  if (isCancel(git)) process.exit(0);

  p.outro("Scaffolding…");

  return {
    projectName: projectName as string,
    siteName: projectName as string,
    siteUrl: siteUrl as string,
    locales: locales as CatalogLocale[],
    cms: cms as CmsOption,
    deploy: deploy as DeployOption,
    themes: themes as ThemeId[],
    i18nRouting: i18nRouting as I18nRouting,
    chromaticToken: (chromaticToken as string)?.trim() || undefined,
    install: install as boolean,
    git: git as boolean,
  };
}
