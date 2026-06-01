import fs from "fs-extra";
import path from "node:path";
import type { ScaffoldOptions } from "../types.js";

export async function applyThemes(projectDir: string, options: ScaffoldOptions) {
  if (options.themes.includes("high-contrast")) return;

  const cssPath = path.join(projectDir, "src", "styles", "themes", "base.css");
  let css = await fs.readFile(cssPath, "utf8");
  css = css.replace(/\n\[data-theme="high-contrast"\][\s\S]*?(?=\n\[data-theme=|\n*$)/, "\n");
  await fs.writeFile(cssPath, css, "utf8");

  for (const file of ["ui-strings.ts", "ui.ts"]) {
    const uiPath = path.join(projectDir, "src", "i18n", file);
    if (!(await fs.pathExists(uiPath))) continue;
    let ui = await fs.readFile(uiPath, "utf8");
    ui = ui.replace(/\n\s*"theme\.highContrast":[^\n]+/g, "");
    await fs.writeFile(uiPath, ui, "utf8");
  }
}
