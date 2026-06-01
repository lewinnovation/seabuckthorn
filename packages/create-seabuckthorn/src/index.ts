#!/usr/bin/env node
import * as p from "@clack/prompts";
import { execa } from "execa";
import path from "node:path";
import { applyScaffoldOptions } from "./apply/index.js";
import { copyTemplate } from "./copy.js";
import { flagsToOptions, HELP_TEXT, parseArgv } from "./parse-args.js";
import { runPrompts } from "./prompts.js";
import type { ScaffoldOptions } from "./types.js";

async function scaffold(options: ScaffoldOptions) {
  const spinner = p.spinner();
  spinner.start("Copying template");
  await copyTemplate(options.projectDir);
  spinner.stop("Template copied");

  spinner.start("Applying options");
  await applyScaffoldOptions(options.projectDir, options);
  spinner.stop("Options applied");

  if (options.install) {
    spinner.start("Installing dependencies");
    await execa("pnpm", ["install"], { cwd: options.projectDir, stdio: "inherit" });
    spinner.stop("Dependencies installed");
  }

  if (options.git) {
    spinner.start("Initializing git");
    await execa("git", ["init"], { cwd: options.projectDir, stdio: "ignore" });
    spinner.stop("Git initialized");
  }

  const rel = path.relative(process.cwd(), options.projectDir) || ".";
  p.outro(`Done! cd ${rel} && pnpm dev`);
}

async function main() {
  const { targetDir: positionalDir, flags } = parseArgv(process.argv.slice(2));

  if (flags.help) {
    console.log(HELP_TEXT);
    return;
  }

  let resolvedDir: string;
  if (positionalDir) {
    resolvedDir = path.resolve(positionalDir);
  } else if (flags.yes) {
    resolvedDir = path.resolve("my-seabuckthorn-site");
  } else {
    const answer = await p.text({
      message: "Project directory",
      defaultValue: "my-seabuckthorn-site",
    });
    if (p.isCancel(answer)) process.exit(0);
    resolvedDir = path.resolve(String(answer));
  }

  const dirName = path.basename(resolvedDir);

  let interactive: Partial<ScaffoldOptions> = {};
  if (!flags.yes) {
    const hasFlags =
      flags.locales ||
      flags.cms ||
      flags.deploy ||
      flags.themes ||
      flags.name ||
      flags.site ||
      flags.chromaticToken;
    if (!hasFlags) {
      interactive = await runPrompts(resolvedDir, dirName);
    }
  }

  const options = flagsToOptions(resolvedDir, flags, interactive);
  await scaffold(options);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
