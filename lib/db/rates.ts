import { db, goldRateOverride } from '@/db';
import { desc } from 'drizzle-orm';

export type { GoldRateOverride } from '@/db/schema';

/* ─── Read ───────────────────────────────────────────────────────── */

/**
 * Returns the most recent active manual override, or null if none exists
 * or the latest override has expired.
 */
export async function getGoldRateOverride() {
  const [row] = await db
    .select()
    .from(goldRateOverride)
    .orderBy(desc(goldRateOverride.updated_at))
    .limit(1);

  if (!row) return null;

  // Check expiry
  if (row.override_until && new Date(row.override_until) < new Date()) {
    return null;
  }

  return row;
}

/* ─── Set ────────────────────────────────────────────────────────── */

export async function setGoldRateOverride(data: {
  rate_24k: string;
  rate_22k: string;
  rate_20k: string;
  rate_18k: string;
  override_until?: Date | null;
}) {
  // Always insert a new row — the GET query reads latest
  const [row] = await db
    .insert(goldRateOverride)
    .values({
      rate_24k:       data.rate_24k,
      rate_22k:       data.rate_22k,
      rate_20k:       data.rate_20k,
      rate_18k:       data.rate_18k,
      is_manual:      true,
      override_until: data.override_until ?? null,
      updated_at:     new Date(),
    })
    .returning();
  return row;
}

/* ─── Clear ──────────────────────────────────────────────────────── */

/**
 * "Clearing" is done by inserting a row with override_until = now,
 * so the GET query sees it as expired and returns null.
 */
export async function clearGoldRateOverride() {
  const [latest] = await db
    .select()
    .from(goldRateOverride)
    .orderBy(desc(goldRateOverride.updated_at))
    .limit(1);

  if (!latest) return;

  // Expire it immediately by setting override_until to now
  const now = new Date();
  await db
    .insert(goldRateOverride)
    .values({
      rate_24k:       latest.rate_24k,
      rate_22k:       latest.rate_22k,
      rate_20k:       latest.rate_20k,
      rate_18k:       latest.rate_18k,
      is_manual:      false,
      override_until: now,
      updated_at:     now,
    });
}
