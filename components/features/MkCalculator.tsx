'use client';
import { getUtmParams } from '@/lib/utm';

import { useId, useState } from 'react';
import { useGoldRate } from '@/hooks/useGoldRate';
import { MkButton } from '@/components/ui/MkButton';
import type { CalculatorVariant } from '@/types/gold-rate';

/* ─── Props ──────────────────────────────────────────────────── */

export interface MkCalculatorProps {
  variant?: CalculatorVariant;
  showBookingCTA?: boolean;
  defaultUnlocked?: boolean;
}

/* ─── Constants ──────────────────────────────────────────────── */

const PURITY_OPTIONS: { value: 22 | 24; label: string }[] = [
  { value: 22, label: '22K Gold (Most common)' },
  { value: 24, label: '24K Gold (Pure / Coins)' },
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

/* ─── Component ───────────────────────────────────────────────── */

export function MkCalculator({
  variant = 'light',
  showBookingCTA = false,
  defaultUnlocked = false,
}: MkCalculatorProps) {
  const uid    = useId();
  const isDark = variant === 'dark';

  const [unlocked,  setUnlocked]  = useState(defaultUnlocked);
  const [gateForm,  setGateForm]  = useState({ name: '', phone: '', goldType: '', weight: '', purity: '' });
  const [gateStatus, setGateStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState('');

  const [purity,    setPurity]    = useState<22 | 24>(22);
  const [weight,    setWeight]    = useState('');

  const { rate24K, rate22K, isLoading } = useGoldRate();

  const rateMap: Record<22 | 24, number> = {
    24: rate24K,
    22: rate22K,
  };

  async function handleGateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError('');

    // Client-side phone validation — 10-digit Indian mobile (starts 6–9)
    const cleanPhone = gateForm.phone.replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number');
      return;
    }

    setGateStatus('loading');

    // Map form field names to API field names
    const puritiyKarat = gateForm.purity === '24k' ? 24 : gateForm.purity === '22k' ? 22 : undefined;
    const weightGrams  = gateForm.weight ? parseFloat(gateForm.weight) : undefined;
    const estRate      = puritiyKarat === 24 ? rate24K : puritiyKarat === 22 ? rate22K : undefined;
    const estimatedValue = estRate && weightGrams ? Math.round(estRate * weightGrams * 0.975) : undefined;

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:            gateForm.name,
          phone:           cleanPhone,
          gold_type:       gateForm.goldType || undefined,
          weight_grams:    weightGrams != null ? String(weightGrams) : undefined,
          purity_karat:    puritiyKarat,
          estimated_value: estimatedValue != null ? String(estimatedValue) : undefined,
          source:          'calculator-gate',
          ...getUtmParams(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setPhoneError(data?.error ?? 'Something went wrong. Please try again.');
        setGateStatus('error');
        return;
      }
    } catch {
      setPhoneError('Network error. Please check your connection.');
      setGateStatus('error');
      return;
    }
    setUnlocked(true);
    setGateStatus('idle');
  }

  const weightNum     = parseFloat(weight) || 0;
  const baseRate      = rateMap[purity];
  // MK pays 97.5% of MCX-linked rate; ±2% range covers branch variation
  const mid           = weightNum > 0
    ? Math.round(baseRate * weightNum * 0.975)
    : null;
  const estimateLow   = mid !== null ? Math.round(mid * 0.98) : null;
  const estimateHigh  = mid !== null ? Math.round(mid * 1.02) : null;

  const inputClass  = `mk-input${isDark  ? ' mk-input--dark'  : ''}`;
  const selectClass = `mk-select${isDark ? ' mk-select--dark' : ''}`;

  if (!unlocked) {
    return (
      <div className={`mk-calc mk-calc--${variant}`}>
        <p className="mk-calc__gate-title" style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 'var(--t-base)', color: isDark ? 'white' : 'var(--ink)', marginBottom: '0.25rem' }}>
          Get Your Gold Value
        </p>
        <p className="mk-calc__gate-sub" style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-sm)', color: isDark ? 'rgba(255,255,255,0.65)' : 'var(--ink-mid)', marginBottom: '1.25rem' }}>
          Fill in your details to unlock the calculator
        </p>
        <form onSubmit={handleGateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input type="text" className="mk-input" placeholder="Full Name" required value={gateForm.name} onChange={e => setGateForm(f => ({ ...f, name: e.target.value }))} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <input
              type="tel"
              className={`mk-input${phoneError ? ' mk-input--error' : ''}`}
              placeholder="10-digit mobile number"
              required
              inputMode="numeric"
              maxLength={10}
              value={gateForm.phone}
              onChange={e => { setGateForm(f => ({ ...f, phone: e.target.value })); setPhoneError(''); }}
            />
            {phoneError && (
              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.72rem', color: '#ef4444' }}>
                {phoneError}
              </span>
            )}
          </div>
          <select className="mk-select" required value={gateForm.goldType} onChange={e => setGateForm(f => ({ ...f, goldType: e.target.value }))}>
            <option value="" disabled>Gold Type</option>
            <option value="jewellery">Gold Jewellery</option>
            <option value="coins">Gold Coins</option>
            <option value="bars">Gold Bars</option>
            <option value="broken">Broken / Damaged Gold</option>
            <option value="pledged">Pledged Gold (bank/NBFC)</option>
          </select>
          <input type="number" className="mk-input" placeholder="Approx. Weight (grams)" min="0.1" step="0.1" value={gateForm.weight} onChange={e => setGateForm(f => ({ ...f, weight: e.target.value }))} />
          <select className="mk-select" value={gateForm.purity} onChange={e => setGateForm(f => ({ ...f, purity: e.target.value }))}>
            <option value="" disabled>Gold Purity</option>
            <option value="24k">24K (Pure / Coins)</option>
            <option value="22k">22K (Most common)</option>
            <option value="unknown">Not sure (we test free)</option>
          </select>
          <button type="submit" className="mk-btn mk-btn--gold" disabled={gateStatus === 'loading'} style={{ width: '100%', padding: '0.75rem 1.25rem', fontSize: 'var(--t-base)', opacity: gateStatus === 'loading' ? 0.7 : 1 }}>
            {gateStatus === 'loading' ? 'Please wait…' : 'Submit & See Calculator'}
          </button>
        </form>
      </div>
    );
  }

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
          onChange={(e) => setPurity(Number(e.target.value) as 22 | 24)}
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
          onClick={() => window.dispatchEvent(new CustomEvent('mk:openPopup'))}
          style={{ width: '100%' }}
        >
          Book Appointment
        </MkButton>
      )}
    </div>
  );
}
