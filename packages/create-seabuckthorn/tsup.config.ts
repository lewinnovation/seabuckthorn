import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node22",
  outExtension: () => ({ js: ".mjs" }),
  clean: true,
  splitting: false,
});
