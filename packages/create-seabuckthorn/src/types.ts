import type {
  CatalogLocale,
  CmsOption,
  DeployOption,
  I18nRouting,
  ThemeId,
} from "./constants.js";

export interface ScaffoldOptions {
  projectDir: string;
  projectName: string;
  siteName: string;
  siteUrl: string;
  locales: CatalogLocale[];
  defaultLocale: CatalogLocale;
  cms: CmsOption;
  deploy: DeployOption;
  themes: ThemeId[];
  defaultTheme: ThemeId;
  i18nRouting: I18nRouting;
  chromaticToken?: string;
  install: boolean;
  git: boolean;
  yes: boolean;
}

export interface CliFlags {
  help?: boolean;
  yes?: boolean;
  name?: string;
  site?: string;
  locales?: string;
  cms?: string;
  deploy?: string;
  themes?: string;
  i18nRouting?: string;
  chromaticToken?: string;
  install?: boolean;
  noInstall?: boolean;
  git?: boolean;
  noGit?: boolean;
  template?: string;
}
