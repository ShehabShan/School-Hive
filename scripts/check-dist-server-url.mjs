import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const PROD_SERVER_URL = "https://server-six-vert.vercel.app";
const DIST_DIR = join(process.cwd(), "dist");
const LOCAL_SERVER_PATTERNS = [/localhost:\d+/i, /127\.0\.0\.1:\d+/i, /0\.0\.0\.0:\d+/i];

function listFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...listFiles(full));
    } else if (/\.(js|html|css|json)$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const files = listFiles(DIST_DIR);

let foundProdUrl = false;
const localRefs = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  if (content.includes(PROD_SERVER_URL)) foundProdUrl = true;
  for (const pattern of LOCAL_SERVER_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      localRefs.push(`${relative(DIST_DIR, file)}  ->  ${match[0]}`);
    }
  }
}

const errors = [];

if (!foundProdUrl) {
  errors.push(`production server URL "${PROD_SERVER_URL}" is NOT present in the bundle`);
}

if (localRefs.length > 0) {
  errors.push(
    `found local server reference(s) in the bundle (this would break production):\n  ${localRefs.join("\n  ")}`
  );
}

if (errors.length > 0) {
  console.error("\n[deploy-guard] BUILD REJECTED:");
  for (const err of errors) console.error(`  - ${err}`);
  console.error(
    "\n[deploy-guard] Run the production build with the guarded script instead:\n  npm run build:prod   (or  npm run deploy)"
  );
  process.exit(1);
}

console.log(`[deploy-guard] OK — 0 local refs, production server URL present (${files.length} files scanned)`);