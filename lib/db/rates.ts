import { unstable_cache } from "next/cache";
import { db, goldRateOverride } from "@/db";
import { desc } from "drizzle-orm";

export type { GoldRateOverride } from "@/db/schema";

/* ─── Read ───────────────────────────────────────────────────────── */

/**
 * Returns the most recent active manual override, or null if none is set.
 * Cached by Next.js — only re-queries the DB when admin saves a new rate
 * (revalidateTag('gold-rate') is called by the admin API on every save).
 */
export const getGoldRateOverride = unstable_cache(
  async () => {
    const [row] = await db
      .select()
      .from(goldRateOverride)
      .orderBy(desc(goldRateOverride.updated_at))
      .limit(1);

    if (!row || !row.is_manual) return null;
    return row;
  },
  ["gold-rate-override"],
  { tags: ["gold-rate"] },
);

/* ─── Set ────────────────────────────────────────────────────────── */

export async function setGoldRateOverride(data: {
  rate_24k: string;
  rate_22k: string;
}) {
  const r24 = Number(data.rate_24k);
  const rate_20k = String(Math.round((r24 * 20) / 24));
  const rate_18k = String(Math.round((r24 * 18) / 24));

  // Always insert a new row — the GET query reads the latest
  // override_until is null = permanent until next admin change
  const [row] = await db
    .insert(goldRateOverride)
    .values({
      rate_24k: data.rate_24k,
      rate_22k: data.rate_22k,
      rate_20k,
      rate_18k,
      is_manual: true,
      override_until: null,
      updated_at: new Date(),
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
  const r24 = Number(latest.rate_24k);
  await db.insert(goldRateOverride).values({
    rate_24k: latest.rate_24k,
    rate_22k: latest.rate_22k,
    rate_20k: latest.rate_20k ?? String(Math.round((r24 * 20) / 24)),
    rate_18k: latest.rate_18k ?? String(Math.round((r24 * 18) / 24)),
    is_manual: false,
    override_until: now,
    updated_at: now,
  });
}
