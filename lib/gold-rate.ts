export interface GoldRate {
  timestamp: string; // ISO string
  rate24k: number; // per gram, INR
  rate22k: number;
  mcxRate: number; // MCX per 10g
  source: "admin" | "manual";
  change24k?: number;
  change22k?: number;
}

/**
 * Returns the active admin override rate from the DB.
 * Returns null if no rate has been set by admin yet.
 * No external API calls. Use in Server Components for SSR.
 */
export async function getEffectiveGoldRate(): Promise<GoldRate | null> {
  try {
    const { getGoldRateOverride } = await import("@/lib/db/rates");
    const override = await getGoldRateOverride();
    if (override?.is_manual) {
      const r24 = Number(override.rate_24k);
      const r22 = Number(override.rate_22k);
      return {
        timestamp:
          override.updated_at instanceof Date
            ? override.updated_at.toISOString()
            : String(override.updated_at),
        rate24k: r24,
        rate22k: r22,
        mcxRate: Math.round(r24 * 10),
        source: "manual",
      };
    }
  } catch {
    // DB not ready
  }
  return null;
}
