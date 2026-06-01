import fs from "fs-extra";
import path from "node:path";
import { DEPLOY_README } from "../constants.js";
import type { ScaffoldOptions } from "../types.js";

export async function applyPackage(projectDir: string, options: ScaffoldOptions) {
  const pkgPath = path.join(projectDir, "package.json");
  const pkg = await fs.readJson(pkgPath);
  pkg.name = options.projectName;
  await fs.writeJson(pkgPath, pkg, { spaces: 2 });

  const readmePath = path.join(projectDir, "README.md");
  let readme = await fs.readFile(readmePath, "utf8");
  readme = readme.replace(/^# Seabuckthorn/m, `# ${options.siteName}`);
  const deployNote = DEPLOY_README[options.deploy];
  if (!readme.includes("## Deploy profile")) {
    readme =
      readme.trimEnd() +
      `\n\n## Deploy profile\n\n${deployNote}\n`;
  }
  await fs.writeFile(readmePath, readme, "utf8");

  const envExamplePath = path.join(projectDir, ".env.example");
  let envExample = await fs.readFile(envExamplePath, "utf8");
  envExample = envExample.replace(
    /PUBLIC_SITE_URL=.*/,
    `PUBLIC_SITE_URL=${options.siteUrl}`,
  );
  await fs.writeFile(envExamplePath, envExample, "utf8");
}
