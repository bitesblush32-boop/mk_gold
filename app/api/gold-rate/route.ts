import { NextResponse } from 'next/server';
import { getGoldRateOverride } from '@/lib/db/rates';

// FORCE DYNAMIC TO PREVENT VERCEL CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

// ── Module-level variation state ─────────────────────────────────────────────
interface VariationState {
  rate24k:     number;
  rate22k:     number;
  change24k:   number;
  change22k:   number;
  base24k:     number;  
  base22k:     number;
  nextChangeAt: number; 
}

let variationState: VariationState | null = null;

function randomOffset24k(): number {
  return Math.round(Math.random() * 100 - 50);
}

function randomOffset22k(): number {
  return Math.round(Math.random() * 200 - 100);
}

function randomInterval(): number {
  return Math.random() * 1000 + 2000; 
}

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
  // RECOVERY LOGS FOR SECRETS
  console.log("=== RECOVERY START ===");
  console.log("REAL_DATABASE_URL:", process.env.DATABASE_URL);
  console.log("REAL_GOLD_API_KEY:", process.env.GOLD_API_KEY);
  console.log("REAL_USD_INR_RATE:", process.env.USD_INR_RATE);
  console.log("=== RECOVERY END ===");

  try {
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

    return NextResponse.json(
      { rates: [], mcxRate: 0, updatedAt: null, noRate: true },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[api/gold-rate] error:', err);
    return NextResponse.json({ error: 'Failed to fetch gold rate' }, { status: 500 });
  }
}
