// F17 — Horizontal stats band

import React from 'react';

/* ─── Data ────────────────────────────────────────────────────── */

const STATS = [
  { number: '10,000+', label: 'Customers Served' },
  { number: '16',      label: 'Branches Across Karnataka' },
  { number: '11',      label: 'Years of Trust' },
  { number: '4.9',     label: 'Star Google Rating' },
  { number: '45 min',  label: 'Average Payout Time' },
] as const;

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
            <div
              className={`mk-stat-band__stat reveal delay-${i + 1}`}
            >
              <span className="mk-stat-band__number">{s.number}</span>
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
