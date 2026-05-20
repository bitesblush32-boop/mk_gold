'use client';

import { useState, useEffect } from 'react';

interface KaratRate {
  karat: 22 | 24;
  value: number;   // ₹ per gram
  change?: number; // delta from yesterday, ₹
}

interface MkTickerProps {
  /** Pass rates from server to hydrate immediately */
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

export function MkTicker({ rates: initialRates }: MkTickerProps) {
  const [rates, setRates] = useState<KaratRate[]>(initialRates ?? DEFAULT_RATES);

  useEffect(() => {
    const load = () =>
      fetch('/api/gold-rate')
        .then(r => r.json())
        .then(d => { if (d.rates) setRates(d.rates); })
        .catch(() => {});
    load();
    const id = setInterval(load, 60 * 1000); // poll every 1 min to catch minimum change interval
    return () => clearInterval(id);
  }, []);

  // Separator text between karat items
  const SEP = <span className="mk-ticker__sep" aria-hidden="true">·</span>;

  const items = rates.map((r, i) => {
    const dir = r.change !== undefined ? (r.change >= 0 ? 'up' : 'down') : null;
    const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : null;
    return (
      <span key={r.karat} className="mk-ticker__item">
        <span className="mk-ticker__karat">{KARAT_LABELS[r.karat]}</span>
        <span className="mk-ticker__value">{fmt(r.value)}/g</span>
        {arrow && r.change !== undefined && (
          <span className={`mk-ticker__indicator mk-ticker__indicator--${dir}`}>
            {arrow} {r.change >= 0 ? '+' : ''}{r.change}
          </span>
        )}
        {i < rates.length - 1 && SEP}
      </span>
    );
  });

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
