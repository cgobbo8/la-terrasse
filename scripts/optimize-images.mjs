#!/usr/bin/env node
/**
 * Image optimization script — runs before `astro build`.
 *
 * • Converts PNG / JPG / JPEG → WebP
 * • Resizes images exceeding MAX_WIDTH (preserving aspect ratio)
 * • Re-encodes existing WebP at target quality
 * • Updates file references in src/content/ & src/ source files
 * • Removes original non-WebP files after conversion
 *
 * Uses `sharp` (already an Astro dependency — no extra install needed).
 * Works on macOS & Linux (no cwebp / sed -i'' differences).
 *
 * Usage: node scripts/optimize-images.mjs [--quality 80] [--max-width 1200]
 */

import { readdir, readFile, writeFile, unlink, stat } from 'node:fs/promises';
import { join, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// ── Config ──────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const IMG_DIR = join(ROOT, 'public', 'images');
const SRC_DIR = join(ROOT, 'src');

const args = process.argv.slice(2);
const QUALITY = parseInt(args[args.indexOf('--quality') + 1]) || 80;
const MAX_WIDTH = parseInt(args[args.indexOf('--max-width') + 1]) || 2048;

const CONVERTIBLE_EXTS = new Set(['.png', '.jpg', '.jpeg']);
const ALL_IMG_EXTS = new Set([...CONVERTIBLE_EXTS, '.webp']);
const MIN_SAVINGS_PCT = 5; // skip re-encode if savings < 5% (avoids lossy re-encoding drift)
const SKIP_PATTERNS = ['apple-touch-icon', 'favicon', 'og-image'];

const SOURCE_GLOBS = ['.yaml', '.astro', '.svelte', '.ts', '.tsx', '.js', '.mdx'];

// ── Helpers ─────────────────────────────────────────────────

/** Recursively collect files under `dir` matching `extSet`. */
async function walk(dir, extSet) {
  const results = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...await walk(full, extSet));
    } else if (extSet.has(extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

function shouldSkip(filePath) {
  return SKIP_PATTERNS.some((p) => filePath.includes(p));
}

function humanSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/** Replace all occurrences of `from` with `to` in source files. */
async function updateReferences(from, to) {
  const sourceFiles = await walk(SRC_DIR, new Set(SOURCE_GLOBS));
  const updated = [];

  for (const file of sourceFiles) {
    const content = await readFile(file, 'utf-8');
    if (content.includes(from)) {
      await writeFile(file, content.replaceAll(from, to), 'utf-8');
      updated.push(relative(ROOT, file));
    }
  }
  return updated;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log(`\n🖼  Image optimization (quality: ${QUALITY}, max-width: ${MAX_WIDTH}px)`);
  console.log(`   Scanning ${relative(ROOT, IMG_DIR)}/...\n`);

  const allImages = await walk(IMG_DIR, ALL_IMG_EXTS);

  let converted = 0;
  let optimized = 0;
  let skipped = 0;
  let totalBefore = 0;
  let totalAfter = 0;

  for (const filePath of allImages) {
    const ext = extname(filePath).toLowerCase();
    const relPath = relative(ROOT, filePath);

    if (shouldSkip(filePath)) {
      skipped++;
      continue;
    }

    const before = (await stat(filePath)).size;
    const meta = await sharp(filePath).metadata();

    // ── Convert PNG/JPG → WebP ────────────────────────────
    if (CONVERTIBLE_EXTS.has(ext)) {
      const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');
      const needsResize = meta.width && meta.width > MAX_WIDTH;

      let pipeline = sharp(filePath);
      if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      await pipeline.webp({ quality: QUALITY }).toFile(webpPath);

      const after = (await stat(webpPath)).size;
      const savings = Math.round((1 - after / before) * 100);
      totalBefore += before;
      totalAfter += after;

      const dims = needsResize ? ` ${meta.width}→${MAX_WIDTH}w` : '';
      console.log(`  convert: ${relPath} → .webp  ${humanSize(before)} → ${humanSize(after)} (-${savings}%)${dims}`);

      // Update references in source files
      const publicFrom = '/' + relative(join(ROOT, 'public'), filePath);
      const publicTo = publicFrom.replace(/\.(png|jpe?g)$/i, '.webp');
      const refs = await updateReferences(publicFrom, publicTo);
      for (const r of refs) console.log(`      ref: ${r}`);

      // Remove original
      await unlink(filePath);
      converted++;
      continue;
    }

    // ── Optimize existing WebP ────────────────────────────
    if (ext === '.webp') {
      const needsResize = meta.width && meta.width > MAX_WIDTH;

      // Only re-encode if resize is needed — avoids lossy re-encoding drift
      if (!needsResize) {
        skipped++;
        continue;
      }

      const buffer = await sharp(filePath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer();

      await writeFile(filePath, buffer);
      const after = buffer.length;
      const savings = Math.round((1 - after / before) * 100);
      totalBefore += before;
      totalAfter += after;

      console.log(`  optimize: ${relPath}  ${humanSize(before)} → ${humanSize(after)} (-${savings}%) ${meta.width}→${MAX_WIDTH}w`);
      optimized++;
      continue;
    }
  }

  // ── Summary ──────────────────────────────────────────────
  console.log('\n---');
  console.log(`Converted: ${converted}  |  Optimized: ${optimized}  |  Skipped: ${skipped}`);
  if (converted + optimized > 0) {
    const totalSavings = Math.round((1 - totalAfter / totalBefore) * 100);
    console.log(`Before: ${humanSize(totalBefore)}  →  After: ${humanSize(totalAfter)}  (−${totalSavings}%)`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
