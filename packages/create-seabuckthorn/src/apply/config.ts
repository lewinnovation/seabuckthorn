import fs from "fs-extra";
import path from "node:path";
import type { ScaffoldOptions } from "../types.js";

export async function writeSeabuckthornConfig(
  projectDir: string,
  options: ScaffoldOptions,
): Promise<void> {
  const chromatic = Boolean(options.chromaticToken);
  const locales = options.locales.map((l) => `"${l}"`).join(", ");
  const themes = options.themes.map((t) => `"${t}"`).join(", ");

  const content = `export default {
  siteName: ${JSON.stringify(options.siteName)},
  locales: [${locales}] as const,
  defaultLocale: ${JSON.stringify(options.defaultLocale)},
  cms: ${JSON.stringify(options.cms)} as "none" | "webiny",
  deploy: ${JSON.stringify(options.deploy)} as
    | "vercel"
    | "netlify"
    | "cloudflare"
    | "aws-s3"
    | "static-only",
  i18nRouting: ${JSON.stringify(options.i18nRouting)} as "prefix" | "hidden-default",
  storybook: true,
  chromatic: ${chromatic},
  themes: [${themes}] as const,
  defaultTheme: ${JSON.stringify(options.defaultTheme)} as const,
} as const;
`;

  await fs.writeFile(path.join(projectDir, "seabuckthorn.config.ts"), content, "utf8");
}
