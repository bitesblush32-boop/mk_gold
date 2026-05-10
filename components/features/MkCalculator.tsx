'use client';

import { useId, useState } from 'react';
import { useGoldRate } from '@/hooks/useGoldRate';
import { MkButton } from '@/components/ui/MkButton';
import type {
  CalculatorVariant,
  GoldCondition,
  GoldKarat,
} from '@/types/gold-rate';

/* ─── Props ──────────────────────────────────────────────────── */

export interface MkCalculatorProps {
  variant?: CalculatorVariant;
  showBookingCTA?: boolean;
}

/* ─── Constants ──────────────────────────────────────────────── */

const PURITY_OPTIONS: { value: GoldKarat; label: string }[] = [
  { value: 22, label: '22K Gold (Most common)' },
  { value: 24, label: '24K Gold (Pure / Coins)' },
  { value: 20, label: '20K Gold' },
  { value: 18, label: '18K Gold' },
];

const CONDITION_MULTIPLIER: Record<GoldCondition, number> = {
  perfect: 1.0,
  broken:  0.85,
};

/* ─── Helpers ────────────────────────────────────────────────── */

function fmt(v: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

/* ─── Component ───────────────────────────────────────────────── */

export function MkCalculator({
  variant = 'light',
  showBookingCTA = false,
}: MkCalculatorProps) {
  const uid    = useId();
  const isDark = variant === 'dark';

  const [purity,    setPurity]    = useState<GoldKarat>(22);
  const [weight,    setWeight]    = useState('');
  const [condition, setCondition] = useState<GoldCondition>('perfect');

  const { rate24K, rate22K, rate20K, rate18K, isLoading } = useGoldRate();

  const rateMap: Record<GoldKarat, number> = {
    24: rate24K,
    22: rate22K,
    20: rate20K,
    18: rate18K,
  };

  const weightNum     = parseFloat(weight) || 0;
  const baseRate      = rateMap[purity];
  const condMult      = CONDITION_MULTIPLIER[condition];
  // MK pays 97.5% of MCX-linked rate; ±2% range covers branch variation
  const mid           = weightNum > 0
    ? Math.round(baseRate * weightNum * 0.975 * condMult)
    : null;
  const estimateLow   = mid !== null ? Math.round(mid * 0.98) : null;
  const estimateHigh  = mid !== null ? Math.round(mid * 1.02) : null;

  const inputClass  = `mk-input${isDark  ? ' mk-input--dark'  : ''}`;
  const selectClass = `mk-select${isDark ? ' mk-select--dark' : ''}`;

  return (
    <div className={`mk-calc mk-calc--${variant}`}>

      {/* ── Purity ─────────────────────────────────────────── */}
      <div className="mk-calc__field">
        <label className="mk-calc__label" htmlFor={`${uid}-purity`}>
          Gold Purity
        </label>
        <select
          id={`${uid}-purity`}
          className={selectClass}
          value={purity}
          onChange={(e) => setPurity(Number(e.target.value) as GoldKarat)}
        >
          {PURITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* ── Weight ─────────────────────────────────────────── */}
      <div className="mk-calc__field">
        <label className="mk-calc__label" htmlFor={`${uid}-weight`}>
          Weight (grams)
        </label>
        <input
          id={`${uid}-weight`}
          type="number"
          className={inputClass}
          placeholder="Enter weight e.g. 10"
          min="0.1"
          max="5000"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </div>

      {/* ── Condition toggle ────────────────────────────────── */}
      <div className="mk-calc__field">
        <span className="mk-calc__label" id={`${uid}-cond-label`}>
          Condition
        </span>
        <div
          className="mk-calc__condition"
          role="group"
          aria-labelledby={`${uid}-cond-label`}
        >
          {(['perfect', 'broken'] as GoldCondition[]).map((c) => (
            <button
              key={c}
              type="button"
              className={[
                'mk-calc__condition-btn',
                isDark    ? 'mk-calc__condition-btn--dark'   : '',
                condition === c ? 'mk-calc__condition-btn--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => setCondition(c)}
              aria-pressed={condition === c}
            >
              {c === 'perfect' ? 'Good condition' : 'Broken / Damaged'}
              {c === 'broken' && (
                <span className="mk-calc__condition-note">&thinsp;×0.85</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Result ─────────────────────────────────────────── */}
      <div
        className={`mk-calc__result${mid === null ? ' mk-calc__result--empty' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {mid !== null ? (
          <>
            <p className="mk-calc__result-label">
              Your gold could be worth approx
            </p>
            <p className="mk-calc__result-range">
              {fmt(estimateLow!)}
              <span className="mk-calc__result-dash">&ensp;–&ensp;</span>
              {fmt(estimateHigh!)}
            </p>
            <p className="mk-calc__result-note">
              Range accounts for ±2% branch variation
            </p>
          </>
        ) : (
          <p className="mk-calc__result-placeholder">
            {isLoading
              ? 'Loading live rates…'
              : 'Enter weight above to see your estimate'}
          </p>
        )}
      </div>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <p className="mk-calc__disclaimer">
        Exact value confirmed at branch after certified XRF test.
      </p>

      {/* ── Optional booking CTA ───────────────────────────── */}
      {showBookingCTA && (
        <MkButton
          variant={isDark ? 'gold' : 'plum'}
          href="/contact"
          style={{ width: '100%' }}
        >
          Book Appointment
        </MkButton>
      )}
    </div>
  );
}
