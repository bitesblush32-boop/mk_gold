export interface GoldRate {
  timestamp: string;           // ISO string
  rate24k: number;             // per gram, INR
  rate22k: number;
  mcxRate: number;             // MCX per 10g
  source: "admin" | "fallback" | "manual";
  change24k?: number;          // delta vs previous bucket (manual only)
  change22k?: number;
}

// Default rates shown when no admin override is set
export const FALLBACK_RATE_24K = 7200;
export const FALLBACK_RATE_22K = 6600;

/**
 * Returns the active admin override rate if one is set in the DB,
 * otherwise returns the hardcoded fallback. No external API calls.
 * Use this in Server Components for SSR/ISR pages.
 */
export async function getEffectiveGoldRate(): Promise<GoldRate> {
  try {
    const { getGoldRateOverride } = await import('@/lib/db/rates');
    const override = await getGoldRateOverride();
    if (override?.is_manual) {
      const r24 = Number(override.rate_24k);
      const r22 = Number(override.rate_22k);
      return {
        timestamp: override.updated_at instanceof Date
          ? override.updated_at.toISOString()
          : String(override.updated_at),
        rate24k: r24,
        rate22k: r22,
        mcxRate: Math.round(r24 * 10),
        source: 'manual',
      };
    }
  } catch {
    // DB not ready or no override — use fallback
  }
  return {
    timestamp: new Date().toISOString(),
    rate24k: FALLBACK_RATE_24K,
    rate22k: FALLBACK_RATE_22K,
    mcxRate: Math.round(FALLBACK_RATE_24K * 10),
    source: 'fallback',
  };
}
