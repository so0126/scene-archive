import { copyFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(rootDir, "..", "dist");
const indexPath = resolve(distDir, "index.html");
const notFoundPath = resolve(distDir, "404.html");
const noJekyllPath = resolve(distDir, ".nojekyll");

if (!existsSync(indexPath)) {
  throw new Error(`Missing build output: ${indexPath}`);
}

mkdirSync(distDir, { recursive: true });
copyFileSync(indexPath, notFoundPath);
writeFileSync(noJekyllPath, "");
