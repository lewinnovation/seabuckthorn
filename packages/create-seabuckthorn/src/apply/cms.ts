import fs from "fs-extra";
import path from "node:path";
import type { ScaffoldOptions } from "../types.js";

export async function applyCms(projectDir: string, options: ScaffoldOptions) {
  const envExamplePath = path.join(projectDir, ".env.example");
  let envExample = await fs.readFile(envExamplePath, "utf8");

  if (options.cms === "webiny") {
    const blogDir = path.join(projectDir, "src", "content", "blog");
    for (const locale of ["en", "fr", "de"]) {
      await fs.remove(path.join(blogDir, locale));
    }
    return;
  }

  envExample = envExample.replace(
    /\n# Webiny Headless CMS[\s\S]*?(?=\n# |\n*$)/,
    "\n",
  );
  await fs.writeFile(envExamplePath, envExample.trimEnd() + "\n", "utf8");
}
