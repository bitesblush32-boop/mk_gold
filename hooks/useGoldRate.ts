'use client';

import { useGoldRateContext } from '@/context/GoldRateContext';
import type { GoldKarat, UseGoldRateReturn } from '@/types/gold-rate';

/**
 * Convenience hook that consumes GoldRateContext and derives
 * per-karat values so components don't do array lookups inline.
 *
 * Must be used inside <GoldRateProvider>.
 */
export function useGoldRate(): UseGoldRateReturn {
  const { rates, mcxRate, lastUpdated, isLoading, isError } =
    useGoldRateContext();

  function getRate(karat: GoldKarat): number {
    return rates.find((r) => r.karat === karat)?.value ?? 0;
  }

  const rate22K = getRate(22);

  return {
    rate24K:     getRate(24),
    rate22K,
    mkRate22K:   Math.round(rate22K * 0.975),
    mcxRate,
    lastUpdated,
    isLoading,
    isError,
  };
}
