'use client';

import { useState, useRef, useCallback } from 'react';
import { useGoldRateContext } from '@/context/GoldRateContext';
import { MkButton } from '@/components/ui/MkButton';
import type { KaratRate, RateWidgetVariant } from '@/types/gold-rate';

/* ─── Props ──────────────────────────────────────────────────── */

interface MkRateWidgetProps {
  variant?: RateWidgetVariant;
}

/* ─── Constants ──────────────────────────────────────────────── */

const KARAT_LABELS: Record<number, string> = {
  24: '24K', 22: '22K', 20: '20K', 18: '18K',
};

const PURITY_OPTIONS = [
  { value: '22', label: '22K Gold' },
  { value: '24', label: '24K Gold' },
  { value: '20', label: '20K Gold' },
  { value: '18', label: '18K Gold' },
];

/* ─── Helpers ────────────────────────────────────────────────── */

function fmt(v: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

function getTimeAgo(iso: string | null): string {
  if (!iso) return 'a while ago';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1)  return 'just now';
  if (mins === 1) return '1 min ago';
  return `${mins} min ago`;
}

/* ─── Skeleton ───────────────────────────────────────────────── */

function WidgetSkeleton() {
  return (
    <div className="mk-rw-skeleton" aria-busy="true" aria-label="Loading gold rates">
      {/* Header placeholders */}
      <div className="mk-rw-skeleton__header">
        <div className="mk-rw-skeleton__bar" style={{ width: '8rem', height: '0.875rem' }} />
        <div className="mk-rw-skeleton__bar" style={{ width: '4.5rem', height: '0.875rem' }} />
      </div>
      {/* 2×2 grid placeholders */}
      <div className="mk-rw-skeleton__grid">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="mk-rw-skeleton__cell">
            <div className="mk-rw-skeleton__bar" style={{ width: '2.5rem', height: '0.6rem' }} />
            <div className="mk-rw-skeleton__bar" style={{ width: '5rem',   height: '1.3rem' }} />
            <div className="mk-rw-skeleton__bar" style={{ width: '3.5rem', height: '0.5rem' }} />
          </div>
        ))}
      </div>
      {/* Margin row placeholder */}
      <div className="mk-rw-skeleton__bar" style={{ height: '3.5rem', borderRadius: 'var(--r-lg)' }} />
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────── */

function RateGrid({ rates }: { rates: KaratRate[] }) {
  return (
    <div className="mk-rate-widget__grid" role="list" aria-label="Gold rates by karat">
      {rates.map((r) => (
        <div key={r.karat} className="mk-rate-widget__cell" role="listitem">
          <span className="mk-rate-widget__karat">{KARAT_LABELS[r.karat]}</span>
          <span className="mk-rate-widget__value">{fmt(r.value)}</span>
          <span className="mk-rate-widget__unit">per gram</span>
        </div>
      ))}
    </div>
  );
}

function MarginRow({ mcxRate }: { mcxRate: number }) {
  const mkBuying = Math.round(mcxRate * 0.975);
  return (
    <div className="mk-rate-widget__margin-row" aria-label="Transparent pricing">
      <div className="mk-rate-widget__margin-item">
        <span className="mk-rate-widget__margin-label">MCX Rate</span>
        <span className="mk-rate-widget__margin-val">
          {fmt(mcxRate)}<span className="mk-rate-widget__per">/10g</span>
        </span>
      </div>
      <div className="mk-rate-widget__margin-sep" aria-hidden="true" />
      <div className="mk-rate-widget__margin-item">
        <span className="mk-rate-widget__margin-label">MK Gold Buying</span>
        <span className="mk-rate-widget__margin-val">
          {fmt(mkBuying)}<span className="mk-rate-widget__per">/10g</span>
        </span>
      </div>
      <div className="mk-rate-widget__margin-pill" aria-label="We pay 97.5% of MCX">
        97.5%
      </div>
    </div>
  );
}

function StaleNotice({ lastUpdated }: { lastUpdated: string | null }) {
  return (
    <div className="mk-rate-widget__stale" role="alert">
      Showing cached rate · Last updated {getTimeAgo(lastUpdated)}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────────── */

export function MkRateWidget({ variant = 'hero' }: MkRateWidgetProps) {
  const { rates, mcxRate, lastUpdated, isLoading, isError } = useGoldRateContext();

  // Hero-only: calculator state
  const [purity, setPurity] = useState('22');
  const [weight, setWeight] = useState('');

  // Hero-only: 3D tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const selectedRate = rates.find((r) => r.karat === Number(purity))?.value ?? 0;
  const weightNum    = parseFloat(weight) || 0;
  const estimate     = weightNum > 0 ? Math.round(selectedRate * weightNum * 0.975) : null;

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;
    if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) return;
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    setTilt({
      x:      ((e.clientY - top  - height / 2) / (height / 2)) * 8,
      y:     -((e.clientX - left - width  / 2) / (width  / 2)) * 8,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0, active: false });
  }, []);

  /* ── Compact variant ─────────────────────────────────────── */
  if (variant === 'compact') {
    return (
      <div className="mk-rate-widget mk-rate-widget--compact">
        {isLoading ? (
          <div
            className="mk-rw-skeleton__bar"
            style={{ width: '20rem', height: '0.75rem' }}
            aria-busy="true"
            aria-label="Loading rates"
          />
        ) : (
          <div className="mk-rw-compact__rates" role="list">
            {rates.map((r, i) => (
              <span key={r.karat} className="mk-rw-compact__item" role="listitem">
                <span className="mk-rw-compact__karat">{KARAT_LABELS[r.karat]}</span>
                <span className="mk-rw-compact__value">{fmt(r.value)}</span>
                {i < rates.length - 1 && (
                  <span className="mk-rw-compact__sep" aria-hidden="true">·</span>
                )}
              </span>
            ))}
          </div>
        )}
        <span className="mk-rate-widget__dot" aria-hidden="true" />
      </div>
    );
  }

  /* ── Page variant ────────────────────────────────────────── */
  if (variant === 'page') {
    return (
      <div className="mk-rate-widget mk-rate-widget--page">
        <div className="mk-rate-widget__header">
          <span className="mk-rate-widget__title">Today&apos;s Gold Rate</span>
          <div className="mk-rate-widget__live" aria-label="Live data">
            <span className="mk-rate-widget__dot" aria-hidden="true" />
            <span className="mk-rate-widget__live-label">MCX Live</span>
          </div>
        </div>
        {isLoading ? (
          <WidgetSkeleton />
        ) : (
          <>
            {isError && <StaleNotice lastUpdated={lastUpdated} />}
            <RateGrid rates={rates} />
            <MarginRow mcxRate={mcxRate} />
          </>
        )}
      </div>
    );
  }

  /* ── Hero variant (default) ──────────────────────────────── */
  return (
    <div
      ref={cardRef}
      className="mk-rate-widget"
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.active
          ? 'transform 0.12s ease'
          : 'transform 0.40s cubic-bezier(0.4,0,0.2,1)',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Header */}
      <div className="mk-rate-widget__header">
        <span className="mk-rate-widget__title">Live Gold Rate</span>
        <div className="mk-rate-widget__live" aria-label="Live data">
          <span className="mk-rate-widget__dot" aria-hidden="true" />
          <span className="mk-rate-widget__live-label">MCX Live</span>
        </div>
      </div>

      {isLoading ? (
        <WidgetSkeleton />
      ) : (
        <>
          {isError && <StaleNotice lastUpdated={lastUpdated} />}

          <RateGrid rates={rates} />
          <MarginRow mcxRate={mcxRate} />

          {/* Calculator */}
          <div className="mk-rate-widget__calc">
            <div className="mk-rate-widget__calc-inputs">
              <div className="mk-rate-widget__calc-field">
                <label className="mk-rate-widget__calc-label" htmlFor="rw-purity">
                  Purity
                </label>
                <select
                  id="rw-purity"
                  className="mk-select mk-select--dark"
                  value={purity}
                  onChange={(e) => setPurity(e.target.value)}
                >
                  {PURITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="mk-rate-widget__calc-field">
                <label className="mk-rate-widget__calc-label" htmlFor="rw-weight">
                  Weight (grams)
                </label>
                <input
                  id="rw-weight"
                  type="number"
                  className="mk-input mk-input--dark"
                  placeholder="e.g. 10"
                  min="0.1"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="mk-rate-widget__result" aria-live="polite" aria-atomic="true">
              <span className="mk-rate-widget__result-label">Estimated payout</span>
              <span className="mk-rate-widget__result-value">
                {estimate !== null ? fmt(estimate) : '—'}
              </span>
            </div>
          </div>

          <MkButton variant="gold" href="/contact" style={{ width: '100%' }}>
            Book Appointment for Exact Valuation
          </MkButton>

          <p className="mk-rate-widget__disclaimer">
            MCX data refreshed every 5 min. Actual offer confirmed at branch after XRF test.
          </p>
        </>
      )}
    </div>
  );
}
