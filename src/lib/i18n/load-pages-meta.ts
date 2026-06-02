import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Locale } from "../../i18n/ui";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export type PageMetaEntry = {
  id: string;
  locale: Locale;
  translationKey: string;
  slug: string;
  draft: boolean;
};

function parseFrontmatterField(raw: string, field: string): string | undefined {
  const match = raw.match(new RegExp(`^${field}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim();
}

function parseFrontmatterBool(raw: string, field: string): boolean {
  return parseFrontmatterField(raw, field) === "true";
}

export function loadPagesMetaFromDisk(): PageMetaEntry[] {
  const pagesDir = path.join(repoRoot, "src/content/pages");
  if (!fs.existsSync(pagesDir)) return [];

  const entries: PageMetaEntry[] = [];
  for (const locale of fs.readdirSync(pagesDir)) {
    const localeDir = path.join(pagesDir, locale);
    if (!fs.statSync(localeDir).isDirectory()) continue;

    for (const file of fs.readdirSync(localeDir)) {
      if (!/\.mdx?$/.test(file)) continue;
      const full = path.join(localeDir, file);
      const raw = fs.readFileSync(full, "utf8");
      const translationKey = parseFrontmatterField(raw, "translationKey");
      if (!translationKey) continue;

      const id = `${locale}/${file.replace(/\.mdx?$/, "")}`;
      entries.push({
        id,
        locale: locale as Locale,
        translationKey,
        slug:
          parseFrontmatterField(raw, "urlSlug") ??
          file.replace(/\.mdx?$/, ""),
        draft: parseFrontmatterBool(raw, "draft"),
      });
    }
  }
  return entries;
}
