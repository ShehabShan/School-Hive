import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const prodBuild = join(here, "prod-build.mjs");
const repoRoot = join(here, "..");
const credentialsPath = join(repoRoot, "docs", "CREDENTIALS.md");

await import(prodBuild);

const credentials = readFileSync(credentialsPath, "utf8");
const tokenMatch = credentials.match(/\| `FIREBASE_TOKEN`\s*\|\s*`([^`]+)`/);
if (!tokenMatch) {
  console.error("[deploy] FIREBASE_TOKEN not found in docs/CREDENTIALS.md");
  process.exit(1);
}

const firebaseToken = tokenMatch[1];

console.log("[deploy] Guarded build OK — deploying to Firebase Hosting...");
const result = spawnSync(
  "npx",
  ["firebase-tools", "deploy", "--only", "hosting", "--token", firebaseToken],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  }
);

process.exit(result.status ?? 0);