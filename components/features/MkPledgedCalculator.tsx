'use client';
// Pledged gold payout estimator — loan amount + weight + purity → net payout

import { useId, useState } from 'react';
import { useGoldRate } from '@/hooks/useGoldRate';
import { MkButton } from '@/components/ui/MkButton';
import type { GoldKarat } from '@/types/gold-rate';

const PURITY_OPTIONS: { value: GoldKarat; label: string }[] = [
  { value: 22, label: '22K (Most jewellery)' },
  { value: 24, label: '24K (Pure / Coins)' },
  { value: 20, label: '20K' },
  { value: 18, label: '18K' },
];

function fmt(v: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(v);
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: 'var(--t-xs)',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '0.5rem',
};

export function MkPledgedCalculator() {
  const uid = useId();
  const [loan,   setLoan]   = useState('');
  const [weight, setWeight] = useState('');
  const [purity, setPurity] = useState<GoldKarat>(22);

  const { rate24K, rate22K, rate20K, rate18K, isLoading } = useGoldRate();

  const rateMap: Record<GoldKarat, number> = {
    24: rate24K,
    22: rate22K,
    20: rate20K,
    18: rate18K,
  };

  const weightNum  = parseFloat(weight) || 0;
  const loanNum    = parseFloat(loan)   || 0;
  const goldValue  = weightNum > 0 ? Math.round(rateMap[purity] * weightNum * 0.975) : null;
  const payout     = goldValue !== null && loanNum > 0 ? goldValue - loanNum : null;
  const hasResult  = payout !== null;
  const isPositive = payout !== null && payout >= 0;

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'var(--r-2xl)',
        border: '1px solid rgba(223,193,96,0.15)',
        padding: '2rem',
        maxWidth: '560px',
        margin: '3rem auto 0',
      }}
    >
      {/* ── Inputs ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.75rem' }}>

        <div>
          <label htmlFor={`${uid}-loan`} style={labelStyle}>
            Outstanding loan amount (₹)
          </label>
          <input
            id={`${uid}-loan`}
            type="number"
            className="mk-input mk-input--dark"
            placeholder="e.g. 50000"
            min="0"
            value={loan}
            onChange={(e) => setLoan(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-weight`} style={labelStyle}>
            Gold weight (grams)
          </label>
          <input
            id={`${uid}-weight`}
            type="number"
            className="mk-input mk-input--dark"
            placeholder="e.g. 20"
            min="0.1"
            max="5000"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`${uid}-purity`} style={labelStyle}>
            Gold purity
          </label>
          <select
            id={`${uid}-purity`}
            className="mk-select mk-select--dark"
            value={purity}
            onChange={(e) => setPurity(Number(e.target.value) as GoldKarat)}
          >
            {PURITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* ── Result ──────────────────────────────────────────── */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1.5rem',
          marginBottom: '1.5rem',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {isLoading ? (
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'rgba(255,255,255,0.35)', textAlign: 'center', padding: '0.5rem 0' }}>
            Loading live rates&hellip;
          </p>
        ) : (
          <>
            {/* Math rows */}
            {[
              { label: 'Gold value (estimated)',  value: goldValue !== null ? fmt(goldValue) : '—' },
              { label: 'Outstanding loan',        value: loanNum   >  0    ? fmt(loanNum)   : '—' },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'rgba(255,255,255,0.5)' }}>
                  {label}
                </span>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {value}
                </span>
              </div>
            ))}

            {/* Payout — prominent */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '1rem',
              }}
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                Your payout
              </span>
              <span
                style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: 'var(--t-h3)',
                  color: hasResult
                    ? isPositive ? 'var(--gold)' : '#f87171'
                    : 'rgba(255,255,255,0.25)',
                }}
              >
                {hasResult
                  ? isPositive
                    ? fmt(payout)
                    : 'Loan may exceed value'
                  : '—'}
              </span>
            </div>

            {hasResult && !isPositive && (
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'rgba(255,255,255,0.4)', marginTop: '0.5rem', lineHeight: 1.5 }}>
                Your outstanding loan appears to exceed the gold&apos;s current value. Please call a branch — we can still help you explore your options.
              </p>
            )}
          </>
        )}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────── */}
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginBottom: '1.25rem', lineHeight: 1.5 }}>
        Estimate only. Branch confirmation required. Exact payout subject to live MCX rate and XRF purity test.
      </p>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <MkButton variant="gold" href="/contact" style={{ width: '100%', justifyContent: 'center' }}>
        Book a Confidential Appointment
      </MkButton>
    </div>
  );
}
