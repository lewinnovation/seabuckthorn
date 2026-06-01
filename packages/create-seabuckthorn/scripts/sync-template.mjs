#!/usr/bin/env node
/**
 * Copies the repo-root template into packages/create-seabuckthorn/template/
 * for npm publish. Run from repo root or via pnpm sync:template.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const templateDir = path.join(packageRoot, "template");

const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  "storybook-static",
  "storybook-server",
  ".astro",
  ".git",
  "packages",
]);

const EXCLUDE_FILES = new Set([
  "pnpm-lock.yaml",
  ".DS_Store",
]);

const EXCLUDE_PREFIXES = [".env"];

function shouldExclude(name, isDir) {
  if (EXCLUDE_DIRS.has(name)) return true;
  if (!isDir && EXCLUDE_FILES.has(name)) return true;
  if (!isDir && EXCLUDE_PREFIXES.some((p) => name.startsWith(p) && name !== ".env.example")) {
    return true;
  }
  return false;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    if (shouldExclude(entry.name, entry.isDirectory())) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  await fs.rm(templateDir, { recursive: true, force: true });
  await copyDir(repoRoot, templateDir);
  console.log(`Synced template to ${templateDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
