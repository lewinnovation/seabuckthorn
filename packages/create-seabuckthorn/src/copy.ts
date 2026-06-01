import fs from "fs-extra";
import path from "node:path";
import { TEMPLATE_DIR } from "./constants.js";

export async function copyTemplate(targetDir: string, templateDir = TEMPLATE_DIR) {
  if (!(await fs.pathExists(templateDir))) {
    throw new Error(
      `Template not found at ${templateDir}. Run "pnpm sync:template" from the repo root.`,
    );
  }
  if (await fs.pathExists(targetDir)) {
    const entries = await fs.readdir(targetDir);
    if (entries.length > 0) {
      throw new Error(`Directory "${targetDir}" is not empty.`);
    }
  }
  await fs.copy(templateDir, targetDir, { filter: (src) => !src.includes("node_modules") });
}

export function resolveTemplateSource(): string {
  return TEMPLATE_DIR;
}
