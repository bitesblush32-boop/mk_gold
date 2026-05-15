'use client';

import useSWR from 'swr';

interface KaratRate {
  karat: 22 | 24;
  value: number;   // ₹ per gram
  change?: number; // delta from yesterday, ₹
}

interface MkTickerProps {
  /** Pass rates from server to hydrate immediately; SWR refreshes every 5 min */
  rates?: KaratRate[];
}

const KARAT_LABELS: Record<number, string> = {
  24: '24K',
  22: '22K',
};

const DEFAULT_RATES: KaratRate[] = [
  { karat: 24, value: 7200 },
  { karat: 22, value: 6600 },
];

function fmt(v: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function MkTicker({ rates: initialRates }: MkTickerProps) {
  const { data } = useSWR<{ rates: KaratRate[] }>(
    '/api/gold-rate',
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      fallbackData: initialRates ? { rates: initialRates } : undefined,
      revalidateOnFocus: false,
    }
  );

  const rates: KaratRate[] = data?.rates ?? initialRates ?? DEFAULT_RATES;

  // Separator text between karat items
  const SEP = <span className="mk-ticker__sep" aria-hidden="true">·</span>;

  const items = rates.map((r, i) => (
    <span key={r.karat} className="mk-ticker__item">
      <span className="mk-ticker__karat">{KARAT_LABELS[r.karat]}</span>
      <span className="mk-ticker__value">{fmt(r.value)}/g</span>
      {r.change !== undefined && r.change !== 0 && (
        <span className={`mk-ticker__change mk-ticker__change--${r.change > 0 ? 'up' : 'down'}`}>
          {r.change > 0 ? '+' : ''}{fmt(r.change)}
        </span>
      )}
      {i < rates.length - 1 && SEP}
    </span>
  ));

  // Duplicate for seamless CSS loop
  const track = [...Array(2)].map((_, pass) => (
    <span key={pass} className="mk-ticker__pass" aria-hidden={pass === 1 ? 'true' : undefined}>
      {items}
      <span className="mk-ticker__note">
        {SEP} MK Gold Buying Rate: 97.5% of MCX {SEP}
      </span>
    </span>
  ));

  return (
    <div className="mk-ticker" role="region" aria-label="Live gold rates today">
      <div className="mk-ticker__track">
        {track}
      </div>

      {/* Fixed live indicator — right side, outside scroll track */}
      <div className="mk-ticker__live-wrap" aria-hidden="true">
        <span className="mk-ticker__live-dot" />
        <span className="mk-ticker__live-label">LIVE</span>
      </div>
    </div>
  );
}
