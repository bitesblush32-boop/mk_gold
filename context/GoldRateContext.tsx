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
} from '@/types/gold-rate';

/* ─── Context ────────────────────────────────────────────────── */

const GoldRateContext = createContext<GoldRateContextValue>({
  rates:       [],
  mcxRate:     0,
  lastUpdated: null,
  isLoading:   true,
  isError:     false,
});

/* ─── Provider ───────────────────────────────────────────────── */

interface GoldRateProviderProps {
  children:     ReactNode;
  /** Server-fetched admin rates passed from layout — avoids loading flash */
  initialData?: GoldRateData | null;
}

export function GoldRateProvider({ children, initialData }: GoldRateProviderProps) {
  const [data, setData]         = useState<GoldRateData | null>(initialData ?? null);
  const [isLoading, setLoading] = useState(!initialData);
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
    // Poll every 3s — keeps ticker ±200 variation and rate widget both current
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <GoldRateContext.Provider
      value={{
        rates:       data?.rates     ?? [],
        mcxRate:     data?.mcxRate   ?? 0,
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
