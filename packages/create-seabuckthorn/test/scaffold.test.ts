import { execa } from "execa";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const cliEntry = path.join(packageRoot, "dist", "index.mjs");

describe("create-seabuckthorn", () => {
  const tmpRoot = path.join(os.tmpdir(), `seabuckthorn-scaffold-${Date.now()}`);
  const projectDir = path.join(tmpRoot, "en-only");

  beforeAll(async () => {
    await fs.ensureDir(tmpRoot);
    await execa("node", [cliEntry, projectDir, "--yes", "--locales", "en", "--no-install", "--no-git"], {
      cwd: packageRoot,
      env: { ...process.env, FORCE_COLOR: "0" },
    });
  }, 120_000);

  afterAll(async () => {
    await fs.remove(tmpRoot);
  });

  it("writes seabuckthorn.config with selected locales", async () => {
    const configPath = path.join(projectDir, "seabuckthorn.config.ts");
    expect(await fs.pathExists(configPath)).toBe(true);
    const config = await fs.readFile(configPath, "utf8");
    expect(config).toContain('"en"');
    expect(config).not.toContain('"fr"');
    expect(config).toContain('cms: "none"');
  });

  it("removes unused locale pages and content", async () => {
    expect(await fs.pathExists(path.join(projectDir, "src/pages/fr"))).toBe(false);
    expect(await fs.pathExists(path.join(projectDir, "src/content/blog/fr"))).toBe(false);
    expect(await fs.pathExists(path.join(projectDir, "src/pages/index.astro"))).toBe(true);
  });

  it("builds the generated project", async () => {
    await execa("pnpm", ["install"], { cwd: projectDir, stdio: "pipe" });
    await execa("pnpm", ["build"], { cwd: projectDir, stdio: "pipe" });
    expect(await fs.pathExists(path.join(projectDir, "dist"))).toBe(true);
  }, 300_000);
});
