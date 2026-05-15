import { NextResponse } from 'next/server';
import { fetchGoldRate } from '@/lib/gold-rate';
import { getGoldRateOverride } from '@/lib/db/rates';

export const revalidate = 300;

export async function GET() {
  try {
    // 1. Check for active manual override (silently skip if table doesn't exist yet)
    let override = null;
    try { override = await getGoldRateOverride(); } catch { /* migrations not run yet */ }
    if (override && override.is_manual) {
      const r24 = Number(override.rate_24k);
      const r22 = Number(override.rate_22k);
      return NextResponse.json(
        {
          rate24K:    r24,
          rate22K:    r22,
          mcxRate:    Math.round(r24 * 10),
          updatedAt:  override.updated_at instanceof Date
            ? override.updated_at.toISOString()
            : String(override.updated_at),
          source:     'manual' as const,
          rates: [
            { karat: 24, value: r24 },
            { karat: 22, value: r22 },
          ],
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          },
        },
      );
    }

    // 2. Fetch live rate from GoldAPI.io
    const rate = await fetchGoldRate();
    return NextResponse.json(
      {
        rate24K:   rate.rate24k,
        rate22K:   rate.rate22k,
        mcxRate:   rate.mcxRate,
        updatedAt: rate.timestamp,
        source:    rate.source,
        rates: [
          { karat: 24, value: rate.rate24k },
          { karat: 22, value: rate.rate22k },
        ],
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      },
    );
  } catch (err) {
    console.error('[api/gold-rate] error:', err);
    return NextResponse.json({ error: 'Failed to fetch gold rate' }, { status: 500 });
  }
}
