/* ═══════════════════════════════════════════════════════════════
   MK Gold — Gold Rate Types
   Single source of truth for all gold-rate related interfaces.
   Imported by: context, hooks, feature components, API routes.
   ═══════════════════════════════════════════════════════════════ */

/** The four karat purities MK Gold buys */
export type GoldKarat = 18 | 20 | 22 | 24;

/** Physical condition of the gold being sold */
export type GoldCondition = 'perfect' | 'broken';

/** Display variants for the rate widget */
export type RateWidgetVariant = 'hero' | 'page' | 'compact';

/** Display variants for the calculator */
export type CalculatorVariant = 'light' | 'dark';

/** One karat's rate — returned by /api/gold-rate */
export interface KaratRate {
  karat: GoldKarat;
  /** ₹ per gram, already adjusted for karat purity */
  value: number;
}

/** Full payload from /api/gold-rate */
export interface GoldRateData {
  rates: KaratRate[];
  /** MCX gold price in ₹ per 10g (raw MCX quote) */
  mcxRate: number;
  /** ISO 8601 timestamp of last MCX fetch */
  updatedAt: string;
}

/** Shape of values exposed by GoldRateContext */
export interface GoldRateContextValue {
  rates: KaratRate[];
  /** MCX price in ₹/10g */
  mcxRate: number;
  /** ISO timestamp of last successful fetch, null if never fetched */
  lastUpdated: string | null;
  /** True while the very first fetch is in flight (no data yet) */
  isLoading: boolean;
  /** True when fetch failed and we are showing stale/fallback data */
  isError: boolean;
}

/** Convenience shape returned by useGoldRate() hook */
export interface UseGoldRateReturn {
  rate24K: number;
  rate22K: number;
  rate20K: number;
  rate18K: number;
  /** MK Gold's 22K buying rate = rate22K × 0.975 */
  mkRate22K: number;
  /** Raw MCX price in ₹/10g */
  mcxRate: number;
  lastUpdated: string | null;
  isLoading: boolean;
  isError: boolean;
}
