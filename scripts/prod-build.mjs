import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PROD_SERVER_URL = "https://server-six-vert.vercel.app";

const here = dirname(fileURLToPath(import.meta.url));
const checker = join(here, "check-dist-server-url.mjs");

const result = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: process.platform === "win32",
  env: {
    ...process.env,
    VITE_server_url: PROD_SERVER_URL,
  },
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

await import(checker);