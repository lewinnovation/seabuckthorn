import fs from "fs-extra";
import path from "node:path";
import type { ScaffoldOptions } from "../types.js";

export async function applyChromatic(projectDir: string, options: ScaffoldOptions) {
  if (!options.chromaticToken) return;

  const envPath = path.join(projectDir, ".env");
  const lines = [
    `PUBLIC_SITE_URL=${options.siteUrl}`,
    `CHROMATIC_PROJECT_TOKEN=${options.chromaticToken}`,
    "",
  ];
  await fs.writeFile(envPath, lines.join("\n"), "utf8");
}
