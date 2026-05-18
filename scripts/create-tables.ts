/**
 * create-tables.ts
 * Creates all 5 MK Gold tables in Railway PostgreSQL.
 * Run: npx tsx scripts/create-tables.ts
 */

import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL not set in environment');
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require', connect_timeout: 20 });

async function main() {
  console.log('Creating tables...');

  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id               SERIAL PRIMARY KEY,
      name             TEXT NOT NULL,
      phone            TEXT NOT NULL,
      email            TEXT,
      city             TEXT,
      area             TEXT,
      branch_slug      TEXT,
      gold_type        TEXT,
      weight_grams     NUMERIC,
      purity_karat     INTEGER,
      estimated_value  NUMERIC,
      source           TEXT NOT NULL DEFAULT 'website',
      source_page      TEXT,
      utm_source       TEXT,
      utm_medium       TEXT,
      utm_campaign     TEXT,
      utm_content      TEXT,
      status           TEXT NOT NULL DEFAULT 'new',
      notes            TEXT,
      created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ leads');

  await sql`
    CREATE TABLE IF NOT EXISTS appointments (
      id                SERIAL PRIMARY KEY,
      lead_id           INTEGER REFERENCES leads(id),
      name              TEXT NOT NULL,
      phone             TEXT NOT NULL,
      branch_slug       TEXT NOT NULL,
      slot_date         DATE NOT NULL,
      slot_time         TEXT NOT NULL,
      gold_type         TEXT,
      weight_estimate   NUMERIC,
      status            TEXT NOT NULL DEFAULT 'pending',
      confirmation_code TEXT NOT NULL,
      notes             TEXT,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ appointments');

  await sql`
    CREATE TABLE IF NOT EXISTS gold_rate_override (
      id              SERIAL PRIMARY KEY,
      rate_24k        NUMERIC NOT NULL,
      rate_22k        NUMERIC NOT NULL,
      is_manual       BOOLEAN NOT NULL DEFAULT TRUE,
      override_until  TIMESTAMPTZ,
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ gold_rate_override');

  await sql`
    CREATE TABLE IF NOT EXISTS hero_banners (
      id         SERIAL PRIMARY KEY,
      src        TEXT NOT NULL,
      alt        TEXT NOT NULL,
      "order"    INTEGER NOT NULL DEFAULT 0,
      is_active  BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ hero_banners');

  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id              SERIAL PRIMARY KEY,
      title           TEXT NOT NULL,
      slug            TEXT NOT NULL UNIQUE,
      excerpt         TEXT NOT NULL,
      body_json       TEXT NOT NULL,
      category        TEXT NOT NULL,
      cover_image_url TEXT,
      published       BOOLEAN NOT NULL DEFAULT FALSE,
      published_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  console.log('  ✓ blog_posts');

  // Verify
  const tables = await sql`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;
  console.log('\nTables in Railway DB:');
  tables.forEach(t => console.log('  -', t.tablename));

  await sql.end();
  console.log('\nDone.');
}

main().catch(e => { console.error(e); process.exit(1); });
