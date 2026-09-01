import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const prodBuild = join(here, "prod-build.mjs");
const repoRoot = join(here, "..");
const credentialsPath = join(repoRoot, "docs", "CREDENTIALS.md");

// --- DEPLOY PERMISSION GUARD (see AGENTS.md §2) ---
const allowDeploy =
  process.env.DEPLOY_APPROVED === "yes" ||
  process.argv.includes("--allow-deploy") ||
  process.argv.includes("--force");
if (!allowDeploy) {
  console.error(
    "[deploy] ⛔ BLOCKED: owner permission required.\n" +
      "  Do not deploy without explicit owner approval in this session.\n" +
      "  To deploy, either:\n" +
      "    1) Run with DEPLOY_APPROVED=yes  (e.g. DEPLOY_APPROVED=yes npm run deploy)\n" +
      "    2) Pass --allow-deploy           (e.g. npm run deploy -- --allow-deploy)\n" +
      "  Or have the owner write 'deploy approved' and re-run.\n" +
      "  See AGENTS.md §2 'DEPLOY BLOCK' and docs/DEPLOY.md."
  );
  process.exit(1);
}

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