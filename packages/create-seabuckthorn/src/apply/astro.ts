import fs from "fs-extra";
import path from "node:path";
import type { ScaffoldOptions } from "../types.js";

export async function patchAstroConfig(
  projectDir: string,
  options: ScaffoldOptions,
): Promise<void> {
  const configPath = path.join(projectDir, "astro.config.mjs");
  let content = await fs.readFile(configPath, "utf8");

  const prefixDefaultLocale = options.i18nRouting === "prefix";

  content = content.replace(
    /const site = process\.env\.PUBLIC_SITE_URL \?\? "[^"]*";/,
    `const site = process.env.PUBLIC_SITE_URL ?? ${JSON.stringify(options.siteUrl)};`,
  );

  if (content.includes("prefixDefaultLocale:")) {
    content = content.replace(
      /prefixDefaultLocale:\s*(true|false)/,
      `prefixDefaultLocale: ${prefixDefaultLocale}`,
    );
  } else {
    content = content.replace(
      /routing:\s*\{/,
      `routing: {\n      prefixDefaultLocale: ${prefixDefaultLocale},`,
    );
  }

  const fallbackEntries = options.locales
    .filter((l) => l !== options.defaultLocale)
    .map((l) => `      ${l}: ${JSON.stringify(options.defaultLocale)},`)
    .join("\n");

  const fallbackBlock =
    fallbackEntries.length > 0
      ? `    fallback: {\n${fallbackEntries}\n    },`
      : "";

  if (content.includes("fallback:")) {
    content = content.replace(/fallback:\s*\{[^}]*\},?/s, fallbackBlock ? `${fallbackBlock},` : "");
  } else if (fallbackBlock) {
    content = content.replace(
      /routing:\s*\{([^}]*)\}/s,
      (match) => match.replace(/\},?$/, `,\n${fallbackBlock}\n    }`),
    );
  }

  await fs.writeFile(configPath, content, "utf8");
}
