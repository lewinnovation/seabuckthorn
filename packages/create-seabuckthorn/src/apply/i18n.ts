import fs from "fs-extra";
import path from "node:path";
import { Project, SyntaxKind } from "ts-morph";
import { ALL_LOCALES, SCAFFOLD_DIR, type CatalogLocale } from "../constants.js";
import type { ScaffoldOptions } from "../types.js";

async function readScaffold(name: string, locale: string, importDepth: string): Promise<string> {
  const file = path.join(SCAFFOLD_DIR, "pages", name);
  return (await fs.readFile(file, "utf8"))
    .replaceAll("{{LOCALE}}", locale)
    .replaceAll("../../components", `${importDepth}/components`)
    .replaceAll("../../lib/content", `${importDepth}/lib/content`);
}

async function writePage(filePath: string, content: string) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, "utf8");
}

function importPrefix(location: "root" | "prefixed", depth: "page" | "blog") {
  if (location === "root") {
    return depth === "page" ? ".." : "../..";
  }
  return depth === "page" ? "../.." : "../../..";
}

async function writeLocaleRoutes(
  pagesDir: string,
  locale: CatalogLocale,
  location: "root" | "prefixed",
) {
  const base = location === "root" ? pagesDir : path.join(pagesDir, locale);

  await writePage(
    path.join(base, "index.astro"),
    await readScaffold("home.astro", locale, importPrefix(location, "page")),
  );
  await writePage(
    path.join(base, "blog", "index.astro"),
    await readScaffold("blog-index.astro", locale, importPrefix(location, "blog")),
  );
  await writePage(
    path.join(base, "blog", "[slug].astro"),
    await readScaffold("blog-slug.astro", locale, importPrefix(location, "blog")),
  );
}

async function clearPagesTree(pagesDir: string) {
  await fs.remove(path.join(pagesDir, "index.astro"));
  await fs.remove(path.join(pagesDir, "blog"));
  for (const locale of ALL_LOCALES) {
    await fs.remove(path.join(pagesDir, locale));
  }
}

export async function applyI18n(projectDir: string, options: ScaffoldOptions) {
  const pagesDir = path.join(projectDir, "src", "pages");
  const contentDir = path.join(projectDir, "src", "content", "blog");
  const { locales, defaultLocale, i18nRouting } = options;
  const prefixMode = i18nRouting === "prefix";

  for (const locale of ALL_LOCALES) {
    if (!locales.includes(locale)) {
      await fs.remove(path.join(contentDir, locale));
    }
  }

  await clearPagesTree(pagesDir);

  for (const locale of locales) {
    if (prefixMode) {
      await writeLocaleRoutes(pagesDir, locale, "prefixed");
    } else if (locale === defaultLocale) {
      const atRoot = defaultLocale === "en";
      await writeLocaleRoutes(pagesDir, locale, atRoot ? "root" : "prefixed");
    } else {
      await writeLocaleRoutes(pagesDir, locale, "prefixed");
    }
  }

  await pruneUiStrings(projectDir, options);
}

async function pruneUiStrings(projectDir: string, options: ScaffoldOptions) {
  const uiPath = path.join(projectDir, "src", "i18n", "ui-strings.ts");
  if (!(await fs.pathExists(uiPath))) {
    return pruneLegacyUi(projectDir, options);
  }

  const project = new Project();
  const source = project.addSourceFileAtPath(uiPath);
  const uiVar = source.getVariableDeclarationOrThrow("uiStrings");
  const obj = uiVar.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const prop of [...obj.getProperties()]) {
    if (!prop.isKind(SyntaxKind.PropertyAssignment)) continue;
    const name = prop.getName().replace(/['"]/g, "");
    if (!options.locales.includes(name as CatalogLocale)) {
      prop.remove();
    } else {
      updateSiteStrings(prop, options.siteName);
    }
  }

  await source.save();
}

function updateSiteStrings(
  prop: import("ts-morph").PropertyAssignment,
  siteName: string,
) {
  const blockInit = prop.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const titleProp =
    blockInit.getProperty('"site.title"') ?? blockInit.getProperty("site.title");
  if (titleProp?.isKind(SyntaxKind.PropertyAssignment)) {
    titleProp.setInitializer(JSON.stringify(siteName));
  }
  const heroTitle =
    blockInit.getProperty('"home.hero.title"') ?? blockInit.getProperty("home.hero.title");
  if (heroTitle?.isKind(SyntaxKind.PropertyAssignment)) {
    heroTitle.setInitializer(JSON.stringify(`Welcome to ${siteName}`));
  }
}

async function pruneLegacyUi(projectDir: string, options: ScaffoldOptions) {
  const uiPath = path.join(projectDir, "src", "i18n", "ui.ts");
  const project = new Project();
  const source = project.addSourceFileAtPath(uiPath);
  const uiVar = source.getVariableDeclarationOrThrow("ui");
  const initializer = uiVar.getInitializerIfKindOrThrow(SyntaxKind.AsExpression);
  const obj = initializer.getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  for (const prop of [...obj.getProperties()]) {
    if (!prop.isKind(SyntaxKind.PropertyAssignment)) continue;
    const name = prop.getName().replace(/['"]/g, "");
    if (!options.locales.includes(name as CatalogLocale)) {
      prop.remove();
    } else {
      updateSiteStrings(prop, options.siteName);
    }
  }

  await source.save();
}
