#!/usr/bin/env node
/* eslint-env node */

/**
 * Minimal icon fetcher:
 * - Collects icon names from app/apps.yml and app/bookmarks.yml
 * - Downloads only those SVGs from MDI CDN into public/icons
 * - Skips missing icons without failing the build
 */

const fs = require("node:fs/promises");
const path = require("node:path");
const https = require("node:https");
const yaml = require("js-yaml");

const ICON_VERSION = "7.4.47";
const CDN_BASE = `https://cdn.jsdelivr.net/npm/@mdi/svg@${ICON_VERSION}/svg`;

const ROOT = path.resolve(__dirname, "..", "..");
const APPS_FILE = path.join(ROOT, "app", "apps.yml");
const BOOKMARKS_FILE = path.join(ROOT, "app", "bookmarks.yml");
const OUTPUT_DIR = path.resolve(__dirname, "..", "public", "icons");

function normalizeIconName(raw) {
  return String(raw)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

async function readYaml(file) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return yaml.load(raw);
  } catch (err) {
    if (err && err.code === "ENOENT") return null;
    throw err;
  }
}

function collectIcons(data) {
  const names = [];
  if (!data) return names;
  if (Array.isArray(data.links)) {
    for (const entry of data.links) {
      if (entry && typeof entry === "object" && entry.icon) {
        names.push(entry.icon);
      }
    }
  }
  if (Array.isArray(data.categories)) {
    // categories rarely hold icons, but keep code explicit in case of future use
    for (const entry of data.categories) {
      if (entry && typeof entry === "object" && entry.icon) {
        names.push(entry.icon);
      }
    }
  }
  return names;
}

async function main() {
  const icons = new Set();

  const apps = await readYaml(APPS_FILE);
  const bookmarks = await readYaml(BOOKMARKS_FILE);

  collectIcons(apps).forEach((i) => icons.add(i));
  collectIcons(bookmarks).forEach((i) => icons.add(i));

  if (icons.size === 0) {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    return;
  }

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const queue = [...icons].map((name) => normalizeIconName(name));
  const concurrency = Math.min(8, queue.length || 1);

  async function fetchSvg(url) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode !== 200) {
            res.resume(); // drain
            return reject(new Error(`HTTP ${res.statusCode}`));
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        })
        .on("error", reject)
        .setTimeout(8000, function onTimeout() {
          this.destroy(new Error("Timeout"));
        });
    });
  }

  async function saveOne(name) {
    const url = `${CDN_BASE}/${name}.svg`;
    const dest = path.join(OUTPUT_DIR, `${name}.svg`);
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const svg = await fetchSvg(url);
        await fs.writeFile(dest, svg);
        console.log(`saved icon: ${name}`);
        return;
      } catch (err) {
        if (attempt === 2) {
          console.warn(`skip icon ${name}: ${err.message}`);
        }
      }
    }
  }

  let index = 0;
  async function worker() {
    while (index < queue.length) {
      const current = queue[index];
      index += 1;
      await saveOne(current);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
