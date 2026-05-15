import React from 'react';
import Image from 'next/image';
import { MkButton } from '@/components/ui/MkButton';
import { MkRateWidget } from '@/components/features/MkRateWidget';

/* ─── Stats ──────────────────────────────────────────────────── */

const STATS = [
  { value: '15+', label: 'Years of trust' },
  { value: '16', label: 'Branches' },
  { value: '10K+', label: 'Customers served' },
  { value: '30 min', label: 'Payment guarantee' },
] as const;

/* ─── Component ───────────────────────────────────────────────── */

export function MkHero() {
  return (
    <section className="mk-hero mk-bg-dark" aria-label="Homepage hero">

      {/* Background image slideshow — CSS crossfade, no JS */}
      <div className="mk-hero__slides" aria-hidden="true">
        <div className="mk-hero__slide" style={{ animationDelay: '-1s' }}>
          <Image src="/bg-2.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} priority />
        </div>
        <div className="mk-hero__slide" style={{ animationDelay: '4s' }}>
          <Image src="/bg3.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} loading="lazy" />
        </div>
        <div className="mk-hero__slide" style={{ animationDelay: '9s' }}>
          <Image src="/bg-4.jpg" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} loading="lazy" />
        </div>
        <div className="mk-hero__slide" style={{ animationDelay: '14s' }}>
          <Image src="/bg-5.webp" alt="" fill sizes="100vw" style={{ objectFit: 'cover' }} loading="lazy" />
        </div>
        <div className="mk-hero__overlay" />
      </div>

      {/* Purple atmospheric glow — radial, no hard edges */}
      <div className="mk-hero__glow" aria-hidden="true" />

      <div className="mk-container mk-hero__inner">

        {/* ── Left column — copy ─────────────────────────────── */}
        <div className="mk-hero__copy">

          {/* Eyebrow — line + label */}
          <div className="mk-hero__eyebrow reveal delay-1">
            <span className="mk-hero__eyebrow-line" aria-hidden="true" />
            <span className="mk-hero__eyebrow-text">
              Karnataka&apos;s Most Trusted Gold Buyer
            </span>
          </div>

          {/* H1 — display size, Tanker */}
          <h1 className="mk-hero__h1 reveal delay-2">
            Instant{' '}
            <span className="mk-hero__accent">Money.</span>
            <br />
            Lasting Trust.
          </h1>

          {/* Subtitle */}
          <p className="mk-hero__subtitle reveal delay-3">
            Sell gold at MCX-linked rates. XRF purity test.
            Payment in 30 minutes. 16 branches across Karnataka.
          </p>

          {/* CTA row */}
          <div className="mk-hero__cta-row reveal delay-4">
            <MkButton variant="gold" size="lg" href="/sell-gold">
              Sell Gold Today
            </MkButton>
            <MkButton variant="outline-light" size="lg" href="/release-pledged-gold">
              Release Pledged Gold
            </MkButton>
          </div>

          {/* Stats meta row */}
          <div className="mk-hero__meta reveal delay-5" role="list">
            {STATS.map((stat, i) => (
              <React.Fragment key={stat.value}>
                <div className="mk-hero__stat" role="listitem">
                  <span className="mk-hero__stat-value">{stat.value}</span>
                  <span className="mk-hero__stat-label">{stat.label}</span>
                </div>
                {i < STATS.length - 1 && (
                  <span className="mk-hero__stat-sep" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── Right column — rate widget ───────────────────── */}
        <div className="mk-hero__widget reveal-r delay-2">
          <MkRateWidget />
        </div>

      </div>
    </section>
  );
}
