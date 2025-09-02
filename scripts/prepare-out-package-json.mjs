import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const rootPkgPath = join(projectRoot, "package.json");
const outDir = join(projectRoot, "out");
const outPkgPath = join(outDir, "package.json");

const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"));

mkdirSync(outDir, { recursive: true });

const outPkg = {
  name: rootPkg.name,
  productName: rootPkg.productName || rootPkg.name,
  version: rootPkg.version,
  description: rootPkg.description || "",
  author: rootPkg.author || "",
  homepage: rootPkg.homepage || "",
  main: "main/index.js",
  dependencies: {},
};

writeFileSync(outPkgPath, JSON.stringify(outPkg, null, 2));
console.log(`Wrote minimal package.json to ${outPkgPath}`);
