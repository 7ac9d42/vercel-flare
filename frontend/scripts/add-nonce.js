#!/usr/bin/env node
/* eslint-env node */

/**
 * Post-export helper: attach a CSP nonce to every <script> tag in the static HTML.
 * This is required when the host injects a header like:
 *   Content-Security-Policy: script-src 'nonce-<value>' 'self'
 *
 * Usage:
 *   CSP_NONCE=your-nonce npm run build
 * Fallback:
 *   If CSP_NONCE is unset, a hardcoded default is used to match the current host header.
 */

const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "out");
const DEFAULT_NONCE = "cf327bf4c56c877c21edeaa48e498925";
const nonce = process.env.CSP_NONCE || DEFAULT_NONCE;

async function listHtmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

function injectNonce(html, nonceValue) {
  // Add nonce to any <script ...> lacking a nonce attribute.
  return html.replace(/<script(?![^>]*\snonce=)([^>]*)>/g, `<script nonce="${nonceValue}"$1>`);
}

async function main() {
  const htmlFiles = await listHtmlFiles(OUT_DIR);
  if (htmlFiles.length === 0) {
    console.warn("add-nonce: no HTML files found under out/, skipped");
    return;
  }

  await Promise.all(
    htmlFiles.map(async (file) => {
      const original = await fs.readFile(file, "utf8");
      const updated = injectNonce(original, nonce);
      if (updated !== original) {
        await fs.writeFile(file, updated);
      }
    }),
  );

  console.log(`add-nonce: applied nonce "${nonce}" to ${htmlFiles.length} HTML file(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
