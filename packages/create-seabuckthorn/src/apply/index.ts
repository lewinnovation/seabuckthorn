import { applyChromatic } from "./chromatic.js";
import { writeSeabuckthornConfig } from "./config.js";
import { applyCms } from "./cms.js";
import { applyI18n } from "./i18n.js";
import { patchAstroConfig } from "./astro.js";
import { applyPackage } from "./package.js";
import { applyThemes } from "./themes.js";
import type { ScaffoldOptions } from "../types.js";

export async function applyScaffoldOptions(
  projectDir: string,
  options: ScaffoldOptions,
): Promise<void> {
  await writeSeabuckthornConfig(projectDir, options);
  await patchAstroConfig(projectDir, options);
  await applyI18n(projectDir, options);
  await applyCms(projectDir, options);
  await applyThemes(projectDir, options);
  await applyChromatic(projectDir, options);
  await applyPackage(projectDir, options);
}
