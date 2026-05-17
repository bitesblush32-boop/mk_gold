/**
 * One-time script: upload existing /public/banners/ images to Vercel Blob,
 * then update hero_banners DB rows with the CDN URLs.
 *
 * Run: node scripts/migrate-banners-to-blob.mjs
 */

import { put } from '@vercel/blob';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import postgres from 'postgres';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ── env ──────────────────────────────────────────────────────────────────────
const TOKEN   = process.env.BLOB_READ_WRITE_TOKEN;
const DB_URL  = process.env.DATABASE_URL;

if (!TOKEN)  { console.error('BLOB_READ_WRITE_TOKEN not set'); process.exit(1); }
if (!DB_URL) { console.error('DATABASE_URL not set');           process.exit(1); }

const sql = postgres(DB_URL, { ssl: 'require', max: 1 });

// ── banners to migrate (id → filename) ───────────────────────────────────────
const BANNERS = [
  { id: 28, file: '1778828487004-banner1.jpeg' },
  { id: 29, file: '1778828526733-banner.jpeg'  },
  { id: 30, file: '1778828536536-banner3.jpeg' },
  { id: 31, file: '1778828917372-banner2.jpeg' },
];

async function run() {
  for (const { id, file } of BANNERS) {
    const filePath = join(ROOT, 'public', 'banners', file);
    console.log(`\n[${id}] Reading ${file}…`);

    const buffer = await readFile(filePath);
    const blob   = new Blob([buffer], { type: 'image/jpeg' });

    console.log(`[${id}] Uploading to Vercel Blob (${(buffer.length / 1024).toFixed(0)} KB)…`);
    const result = await put(`banners/${file}`, blob, {
      access: 'public',
      token: TOKEN,
    });

    console.log(`[${id}] Blob URL: ${result.url}`);

    // Update DB
    await sql`UPDATE hero_banners SET src = ${result.url} WHERE id = ${id}`;
    console.log(`[${id}] DB updated ✓`);
  }

  console.log('\n── Migration complete ──\n');

  // Print current DB state
  const rows = await sql`SELECT id, src, alt, "order" FROM hero_banners ORDER BY "order"`;
  console.log('Current hero_banners:');
  for (const r of rows) {
    console.log(`  [${r.id}] order=${r.order} alt="${r.alt}"\n       src=${r.src}`);
  }

  await sql.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
