import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Locale } from "../../i18n/ui";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);

export type BlogMetaEntry = {
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
  const value = parseFrontmatterField(raw, field);
  return value === "true";
}

function collectMdxFiles(dir: string, base = dir): BlogMetaEntry[] {
  if (!fs.existsSync(dir)) return [];
  const entries: BlogMetaEntry[] = [];

  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      entries.push(...collectMdxFiles(full, base));
      continue;
    }
    if (!/\.mdx?$/.test(name)) continue;

    const raw = fs.readFileSync(full, "utf8");
    const locale = parseFrontmatterField(raw, "locale") as Locale | undefined;
    const translationKey = parseFrontmatterField(raw, "translationKey");
    if (!locale || !translationKey) continue;

    const relative = path.relative(path.join(repoRoot, "src/content/blog"), full);
    const id = relative.replace(/\.mdx?$/, "");
    const slug =
      parseFrontmatterField(raw, "urlSlug") ??
      path.basename(id).replace(/\.mdx?$/, "");

    entries.push({
      id,
      locale,
      translationKey,
      slug,
      draft: parseFrontmatterBool(raw, "draft"),
    });
  }

  return entries;
}

export function loadBlogMetaFromDisk(): BlogMetaEntry[] {
  const blogDir = path.join(repoRoot, "src/content/blog");
  return collectMdxFiles(blogDir);
}
