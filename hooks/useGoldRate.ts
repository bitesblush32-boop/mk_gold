"use client";

import { useGoldRateContext } from "@/context/GoldRateContext";
import type { GoldKarat, UseGoldRateReturn } from "@/types/gold-rate";

/**
 * Convenience hook that consumes GoldRateContext and derives
 * per-karat values so components don't do array lookups inline.
 *
 * Must be used inside <GoldRateProvider>.
 */
export function useGoldRate(): UseGoldRateReturn {
  const { rates, baseRates, mcxRate, lastUpdated, isLoading, isError } =
    useGoldRateContext();

  function getRate(karat: GoldKarat, src: typeof rates): number {
    return src.find((r) => r.karat === karat)?.value ?? 0;
  }

  const rate22K = getRate(22, rates);
  const baseRate22K = getRate(22, baseRates);

  return {
    rate24K: getRate(24, rates),
    rate22K,
    baseRate24K: getRate(24, baseRates),
    baseRate22K,
    mkRate22K: Math.round(baseRate22K * 0.975),
    mcxRate,
    lastUpdated,
    isLoading,
    isError,
  };
}
