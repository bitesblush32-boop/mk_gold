import { NextResponse } from 'next/server';
import { getGoldRateOverride } from '@/lib/db/rates';

export const revalidate = 0; // disable ISR — manual override uses no-store, live rate uses its own cache

// ── Module-level variation state ─────────────────────────────────────────────
// Persists across requests in the same server process so all users see the
// same "current" varied rate until the next random interval fires.
interface VariationState {
  rate24k:     number;
  rate22k:     number;
  change24k:   number;
  change22k:   number;
  base24k:     number;  // track admin base so we reset if admin changes it
  base22k:     number;
  nextChangeAt: number; // ms timestamp
}

let variationState: VariationState | null = null;

/** Random offset ±50 for 24K */
function randomOffset24k(): number {
  return Math.round(Math.random() * 100 - 50);
}

/** Random offset ±100 for 22K */
function randomOffset22k(): number {
  return Math.round(Math.random() * 200 - 100);
}

/** Random interval between 2 and 3 seconds (in ms) */
function randomInterval(): number {
  return Math.random() * 1000 + 2000; // 2000–3000 ms
}

/** Build a fresh variation snapshot from the admin base rates */
function refreshVariation(base24k: number, base22k: number): VariationState {
  const off24 = randomOffset24k();
  const off22 = randomOffset22k();
  return {
    rate24k:      Math.round(base24k + off24),
    rate22k:      Math.round(base22k + off22),
    change24k:    off24,
    change22k:    off22,
    base24k,
    base22k,
    nextChangeAt: Date.now() + randomInterval(),
  };
}

/** Return current variation, refreshing if interval elapsed or base changed */
function getVariation(base24k: number, base22k: number): VariationState {
  if (
    !variationState ||
    Date.now() >= variationState.nextChangeAt ||
    variationState.base24k !== base24k ||
    variationState.base22k !== base22k
  ) {
    variationState = refreshVariation(base24k, base22k);
  }
  return variationState;
}
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    // 1. Check for active manual override (silently skip if table doesn't exist yet)
    let override = null;
    try { override = await getGoldRateOverride(); } catch { /* migrations not run yet */ }
    if (override && override.is_manual) {
      const base24 = Number(override.rate_24k);
      const base22 = Number(override.rate_22k);
      const varied = getVariation(base24, base22);
      return NextResponse.json(
        {
          rate24K:    varied.rate24k,
          rate22K:    varied.rate22k,
          mcxRate:    Math.round(varied.rate24k * 10),
          updatedAt:  override.updated_at instanceof Date
            ? override.updated_at.toISOString()
            : String(override.updated_at),
          source:     'manual' as const,
          change24K:  varied.change24k,
          change22K:  varied.change22k,
          rates: [
            { karat: 24, value: varied.rate24k, change: varied.change24k, base: base24 },
            { karat: 22, value: varied.rate22k, change: varied.change22k, base: base22 },
          ],
        },
        {
          headers: {
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    // 2. No admin rate set — return empty, no hardcoded fallback
    return NextResponse.json(
      { rates: [], mcxRate: 0, updatedAt: null, noRate: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[api/gold-rate] error:', err);
    return NextResponse.json({ error: 'Failed to fetch gold rate' }, { status: 500 });
  }
}
