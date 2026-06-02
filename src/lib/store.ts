/**
 * Simple JSON file store on persistent volume.
 * Reads/writes to /data/ (Railway volume) or ./data/ (local dev).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = process.env.DATA_DIR || "/data";

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readJson<T>(filename: string, fallback: T): T {
  ensureDir();
  const path = join(DATA_DIR, filename);
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return fallback;
  }
}

export function writeJson(filename: string, data: unknown) {
  ensureDir();
  const path = join(DATA_DIR, filename);
  writeFileSync(path, JSON.stringify(data, null, 2));
}
