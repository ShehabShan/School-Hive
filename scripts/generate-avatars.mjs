#!/usr/bin/env node
// Generate 20 default avatars as static SVGs using @dicebear
import fs from "node:fs";
import path from "node:path";
import { createAvatar } from "@dicebear/core";
import * as adventurer from "@dicebear/adventurer";

// Brand palette from tailwind.config.js + daisyUI schoolhive
// Use soft, accessible colors that match app's look
const backgroundColors = [
  "eef2ff", // brand-50
  "e0e7ff", // brand-100
  "c7d2fe", // brand-200
  "a5b4fc", // brand-300
  "818cf8", // brand-400
  "6366f1", // brand-500
  "4f46e5", // brand-600
  "4338ca", // brand-700
  "312e81", // brand-900-ish
  "f59e0b", // accent amber
  "0ea5e9", // info sky
  "f1f5f9", // base-200 slate
];

const outDir = path.resolve("public/avatars");
fs.mkdirSync(outDir, { recursive: true });

for (let i = 1; i <= 20; i++) {
  const seed = `hive-${String(i).padStart(2, "0")}`;
  const avatar = createAvatar(adventurer, {
    seed,
    backgroundColor: [backgroundColors[(i - 1) % backgroundColors.length]],
    // Keep style consistent, size 200 for crisp display
    radius: 20,
    // Use adventurer defaults, but lock to consistent accessories
  });
  const svg = avatar.toString();
  const file = path.join(outDir, `avatar-${String(i).padStart(2, "0")}.svg`);
  fs.writeFileSync(file, svg, "utf8");
  console.log(`wrote ${file} (${svg.length} bytes) seed=${seed}`);
}
console.log("Done — 20 avatars in", outDir);
