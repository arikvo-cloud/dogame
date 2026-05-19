#!/usr/bin/env node
/**
 * Workaround for Next.js 16 + output:"export" RSC prefetch path mismatch.
 *
 * Next 16 writes RSC prefetch payloads to:
 *   out/<route>/__next.<seg>/<...>.txt
 *
 * but the runtime fetches them at the dot-separated path:
 *   out/<route>/__next.<seg>.<...>.txt
 *
 * curl confirms: slash-path → 200, dot-path → 404.
 *
 * This script walks `out/` after `next build` and mirrors every file inside a
 * `__next.X/` directory to a flat dot-separated filename at the parent level,
 * so prefetches succeed (no console 404s, faster client navigation).
 *
 * Safe to remove once Next.js ships a fix for the path mismatch.
 */

import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "out";
let created = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
      continue;
    }
    if (!st.isFile()) continue;

    // Posix-style for the regex match — backslashes confuse it on Windows.
    const posix = full.split("\\").join("/");
    const m = posix.match(/^(.+)\/(__next\.[^/]+)\/(.+)$/);
    if (!m) continue;

    const [, prefix, nextDir, rest] = m;
    const flatName = nextDir + "." + rest.replaceAll("/", ".");
    const target = join(prefix, flatName);
    try {
      copyFileSync(full, target);
      created += 1;
    } catch (err) {
      console.error(`flatten-rsc-paths: failed to copy ${full} -> ${target}`, err);
    }
  }
}

try {
  statSync(OUT_DIR);
} catch {
  console.error(`flatten-rsc-paths: ${OUT_DIR}/ not found. Run \`next build\` first.`);
  process.exit(1);
}

walk(OUT_DIR);
console.log(`flatten-rsc-paths: mirrored ${created} RSC payload files`);
