'use client';

import { useGoldRateContext } from '@/context/GoldRateContext';

const KARAT_LABELS: Record<number, string> = {
  24: '24K',
  22: '22K',
};

function fmt(v: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

export function MkTicker() {
  const { rates, isLoading } = useGoldRateContext();

  const SEP = <span className="mk-ticker__sep" aria-hidden="true">·</span>;

  // No rates set by admin yet — show a neutral placeholder in the ticker
  if (isLoading || rates.length === 0) {
    return (
      <div className="mk-ticker" role="region" aria-label="Gold rates">
        <div className="mk-ticker__track">
          <span className="mk-ticker__pass">
            <span className="mk-ticker__note">MK Gold Buying Rate: 97.5% of MCX</span>
          </span>
        </div>
        <div className="mk-ticker__live-wrap" aria-hidden="true">
          <span className="mk-ticker__live-dot" />
          <span className="mk-ticker__live-label">LIVE</span>
        </div>
      </div>
    );
  }

  const items = rates.map((r, i) => {
    const dir = r.base !== undefined
      ? (r.value > r.base ? 'up' : r.value < r.base ? 'down' : null)
      : null;
    const arrow = dir === 'up' ? '▲' : dir === 'down' ? '▼' : '';
    return (
      <span key={r.karat} className="mk-ticker__item">
        <span className="mk-ticker__karat">{KARAT_LABELS[r.karat]}</span>
        <span className={`mk-ticker__value${dir ? ` mk-ticker__value--${dir}` : ''}`}>
          {arrow}{arrow ? ' ' : ''}{fmt(r.value)}/gram
        </span>
        {i < rates.length - 1 && SEP}
      </span>
    );
  });

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
      <div className="mk-ticker__live-wrap" aria-hidden="true">
        <span className="mk-ticker__live-dot" />
        <span className="mk-ticker__live-label">LIVE</span>
      </div>
    </div>
  );
}
