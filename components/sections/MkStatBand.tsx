// F17 — Horizontal stats band

import React from 'react';

/* ─── Data ────────────────────────────────────────────────────── */

const STATS = [
  { number: '11+',     label: 'Years of Trust' },
  { number: '16',      label: 'Branches Across Karnataka' },
  { number: '10,000+', label: 'Customers Served' },
  { number: '₹100Cr+', label: 'Gold Purchased Value' },
  { number: '45 min',  label: 'Average Payout Time' },
] as const;

/* ─── Helpers ────────────────────────────────────────────────── */

/** Split a number string so the ₹ symbol renders in Poppins, rest in Tanker */
function StatNumber({ value }: { value: string }) {
  if (value.startsWith('₹')) {
    return (
      <>
        <span style={{ fontFamily: 'Poppins, sans-serif' }}>₹</span>
        <span className="mk-stat-band__number">{value.slice(1)}</span>
      </>
    );
  }
  return <span className="mk-stat-band__number">{value}</span>;
}

/* ─── Component ───────────────────────────────────────────────── */

export function MkStatBand() {
  return (
    <section
      className="mk-stat-band mk-bg-dark"
      aria-label="MK Gold at a glance"
    >
      <div className="mk-container mk-stat-band__inner">
        {STATS.map((s, i) => (
          <React.Fragment key={s.label}>
            <div className={`mk-stat-band__stat reveal delay-${i + 1}`}>
              <StatNumber value={s.number} />
              <span className="mk-stat-band__label">{s.label}</span>
            </div>
            {i < STATS.length - 1 && (
              <div className="mk-stat-band__sep" aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
