'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
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

/* ─── Provider ───────────────────────────────────────────────── */

export function GoldRateProvider({ children }: { children: ReactNode }) {
  const [data, setData]         = useState<GoldRateData | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const load = () => {
      setHasError(false);
      fetch('/api/gold-rate')
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then((d: GoldRateData) => { setData(d); setLoading(false); })
        .catch(() => { setHasError(true); setLoading(false); });
    };
    load();
    const id = setInterval(load, 300_000); // 5 minutes — matches ISR on /api/gold-rate
    return () => clearInterval(id);
  }, []);

  return (
    <GoldRateContext.Provider
      value={{
        rates:       data?.rates     ?? FALLBACK_RATES,
        mcxRate:     data?.mcxRate   ?? FALLBACK_MCX,
        lastUpdated: data?.updatedAt ?? null,
        isLoading,
        isError:     hasError && !data,
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
