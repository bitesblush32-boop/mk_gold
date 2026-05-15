'use client';

import {
  createContext,
  useContext,
  type ReactNode,
} from 'react';
import useSWR from 'swr';
import type {
  GoldRateContextValue,
  GoldRateData,
  KaratRate,
} from '@/types/gold-rate';

/* ─── Fallback data ──────────────────────────────────────────── */

const FALLBACK_RATES: KaratRate[] = [
  { karat: 24, value: 7200 },
  { karat: 22, value: 6600 },
];

const FALLBACK_MCX = 72000;

/* ─── Context ────────────────────────────────────────────────── */

const GoldRateContext = createContext<GoldRateContextValue>({
  rates:       FALLBACK_RATES,
  mcxRate:     FALLBACK_MCX,
  lastUpdated: null,
  isLoading:   false,
  isError:     false,
});

/* ─── Fetcher ────────────────────────────────────────────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = (url: string): Promise<any> =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  });

/* ─── Provider ───────────────────────────────────────────────── */

/**
 * Wrap your app (or a subtree) with this provider.
 * All children can call useGoldRateContext() or useGoldRate()
 * instead of making independent SWR fetches.
 *
 * Add to app/layout.tsx:
 *   import { GoldRateProvider } from '@/context/GoldRateContext';
 *   <GoldRateProvider>{children}</GoldRateProvider>
 */
export function GoldRateProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, error } = useSWR<GoldRateData>(
    '/api/gold-rate',
    fetcher,
    {
      refreshInterval:  300_000, // 5 minutes — matches ISR on /api/gold-rate
      revalidateOnFocus: false,
      // No fallbackData — so isLoading = true on first fetch (enables skeleton)
      dedupingInterval: 60_000,
    }
  );

  return (
    <GoldRateContext.Provider
      value={{
        rates:       data?.rates       ?? FALLBACK_RATES,
        mcxRate:     data?.mcxRate     ?? FALLBACK_MCX,
        lastUpdated: data?.updatedAt   ?? null,
        isLoading,
        isError:     !!error && !data,
      }}
    >
      {children}
    </GoldRateContext.Provider>
  );
}

/* ─── Hook ───────────────────────────────────────────────────── */

export function useGoldRateContext(): GoldRateContextValue {
  return useContext(GoldRateContext);
}
