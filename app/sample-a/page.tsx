import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { GoldRateProvider } from '@/context/GoldRateContext';

/* ─── Metadata ───────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Sample A — Karnataka Legacy | MK Gold',
};

/* ─── Micro-stats data ───────────────────────────────────────── */

const HERO_STATS = [
  { num: '15 ವರ್ಷ',     label: 'ಅನುಭವ'    },
  { num: '16 ಶಾಖೆಗಳು', label: 'ಕರ್ನಾಟಕ'  },
  { num: '10,000+',     label: 'ಗ್ರಾಹಕರು' },
  { num: '45 ನಿಮಿಷ',   label: 'ಪಾವತಿ'    },
] as const;

/* ─── Story pillars data ─────────────────────────────────────── */

const PILLARS = [
  {
    title: 'Fair Value, Every Time',
    body: 'We show you the MCX rate and our margin side by side. You know exactly what we earn. Nothing is hidden, nothing is negotiated under the table.',
  },
  {
    title: 'Dignity in Every Transaction',
    body: 'Selling gold is an emotional decision. We treat every customer with the same respect regardless of the quantity — whether it is 2 grams or 200 grams.',
  },
  {
    title: 'Rooted in Karnataka',
    body: 'From Basaveshwaranagar in 2014 to 16 branches across Bangalore, Mysore, Mangalore and Davangere — this brand was built by Kannadigas, for Kannadigas.',
  },
] as const;

/* ─── Page ───────────────────────────────────────────────────── */

export default function SampleAPage() {
  return (
    <>
      {/* ── Page-scoped styles (transform/opacity only for animations) ── */}
      <style>{`

        /* ════════════════════════════════════════════════════════
           HERO SECTION
           ════════════════════════════════════════════════════════ */

        .sa-hero {
          position: relative;
          overflow: hidden;
          min-height: calc(100dvh - var(--chrome-h));
          display: flex;
          align-items: center;
          padding-block: var(--s-20) var(--s-16);
        }

        /* Gold–purple–gold gradient entry line — single horizontal accent */
        .sa-hero__top-border {
          position: absolute;
          inset-block-start: 0;
          inset-inline: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            #DFC160 20%,
            #7B2C91 50%,
            #DFC160 80%,
            transparent 100%
          );
          z-index: 2;
          pointer-events: none;
        }

        /* Ambient Kannada watermark text — atmosphere only */
        .sa-ambient {
          position: absolute;
          font-family: 'Anek Kannada', sans-serif;
          font-weight: 700;
          font-size: clamp(8rem, 18vw, 18rem);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          z-index: 0;
        }
        .sa-ambient--nambike {
          top: -2rem;
          right: -3rem;
          color: rgba(223, 193, 96, 0.04);
        }
        .sa-ambient--vishvasa {
          bottom: -2rem;
          left: -3rem;
          color: rgba(255, 255, 255, 0.025);
        }

        /* Three-column hero grid */
        .sa-hero__grid {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: var(--max-w);
          margin-inline: auto;
          padding-inline: var(--pad-x);
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--s-12);
          align-items: center;
        }

        /* ── Left col: Story copy ── */

        .sa-story-col {
          display: flex;
          flex-direction: column;
          gap: var(--s-6);
        }

        .sa-pill {
          display: inline-flex;
          flex-direction: column;
          gap: var(--s-1-5);
          align-self: flex-start;
        }
        .sa-pill__kn {
          display: inline-block;
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-2xs);
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #512561;
          background: #DFC160;
          padding: var(--s-1-5) var(--s-4);
          border-radius: var(--r-full);
          line-height: 1.5;
        }
        .sa-pill__en {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255, 255, 255, 0.45);
          padding-left: var(--s-2);
        }

        /* Bilingual H1 */
        .sa-h1 {
          display: flex;
          flex-direction: column;
          gap: var(--s-1);
        }
        .sa-h1__en {
          font-family: 'Tanker', serif;
          font-size: clamp(2.5rem, 5.5vw, 5rem);
          color: #FFFFFF;
          line-height: 1.08;
          letter-spacing: -0.01em;
        }
        .sa-h1__kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: clamp(2rem, 4vw, 3.75rem);
          font-weight: 700;
          color: #DFC160;
          line-height: 1.15;
        }

        .sa-hero-body {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-base);
          color: rgba(255, 255, 255, 0.62);
          max-width: 45ch;
          line-height: var(--lh-relaxed);
        }

        .sa-ctas {
          display: flex;
          gap: var(--s-4);
          flex-wrap: wrap;
        }

        /* Micro-stats row */
        .sa-stats {
          display: flex;
          gap: var(--s-6);
          flex-wrap: wrap;
          padding-top: var(--s-4);
          border-top: 1px solid rgba(223, 193, 96, 0.12);
        }
        .sa-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .sa-stat__num {
          font-family: 'Tanker', serif;
          font-size: clamp(1.1rem, 1.8vw, 1.625rem);
          color: #DFC160;
          line-height: 1;
        }
        .sa-stat__label {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255, 255, 255, 0.45);
          line-height: 1.3;
        }

        /* ── Middle col: 3D Seal Monument ── */

        .sa-monument {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--s-5);
          perspective: 800px;
        }

        /* Temple frame: 4 gold corner marks via ::before/::after + 2 spans */
        .sa-frame {
          position: relative;
          padding: var(--s-6) var(--s-5);
        }
        .sa-frame::before,
        .sa-frame::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
        }
        .sa-frame::before {
          top: 0;
          left: 0;
          border-top: 2px solid #DFC160;
          border-left: 2px solid #DFC160;
        }
        .sa-frame::after {
          top: 0;
          right: 0;
          border-top: 2px solid #DFC160;
          border-right: 2px solid #DFC160;
        }
        .sa-corner-bl,
        .sa-corner-br {
          display: block;
          position: absolute;
          bottom: 0;
          width: 20px;
          height: 20px;
        }
        .sa-corner-bl {
          left: 0;
          border-bottom: 2px solid #DFC160;
          border-left: 2px solid #DFC160;
        }
        .sa-corner-br {
          right: 0;
          border-bottom: 2px solid #DFC160;
          border-right: 2px solid #DFC160;
        }

        /* 3D inner — CSS hover only, no JS required */
        .sa-seal-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--s-5);
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
          will-change: transform;
        }
        .sa-monument:hover .sa-seal-inner {
          transform: rotateY(12deg);
        }

        .sa-monument__text {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--s-1);
        }
        .sa-monument__kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-sm);
          font-weight: 600;
          color: #DFC160;
        }
        .sa-monument__en {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255, 255, 255, 0.40);
        }

        /* ── Right col: Rate widget column ── */

        .sa-widget-col {
          display: flex;
          flex-direction: column;
          gap: var(--s-4);
          min-width: 0;
        }
        .sa-widget-trust {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(223, 193, 96, 0.60);
          text-align: center;
          letter-spacing: 0.02em;
          line-height: var(--lh-normal);
        }

        /* ════════════════════════════════════════════════════════
           BRAND STORY SECTION
           ════════════════════════════════════════════════════════ */

        .sa-brand-story {
          max-width: 680px;
          margin-inline: auto;
          padding-inline: var(--pad-x);
          padding-block: var(--s-20);
        }

        .sa-brand-story__overline {
          display: block;
          text-align: center;
          margin-bottom: var(--s-12);
        }
        .sa-brand-story__overline-kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-sm);
          font-weight: 600;
          color: #DFC160;
        }
        .sa-brand-story__overline-sep {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255, 255, 255, 0.35);
          margin-left: var(--s-2);
        }

        .sa-pillar {
          padding-left: var(--s-6);
          border-left: 3px solid rgba(223, 193, 96, 0.40);
          margin-bottom: var(--s-8);
        }
        .sa-pillar__title {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-base);
          font-weight: 600;
          color: #FFFFFF;
          margin-bottom: var(--s-2);
          line-height: var(--lh-snug);
        }
        .sa-pillar__body {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: rgba(255, 255, 255, 0.62);
          line-height: var(--lh-relaxed);
        }

        .sa-pullquote {
          text-align: center;
          padding-top: var(--s-10);
          border-top: 1px solid rgba(223, 193, 96, 0.10);
        }
        .sa-pullquote__text {
          font-family: 'Tanker', serif;
          font-size: var(--t-h2);
          color: #DFC160;
          line-height: var(--lh-snug);
          display: block;
          margin-bottom: var(--s-3);
        }
        .sa-pullquote__trans {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: rgba(255, 255, 255, 0.40);
          font-style: italic;
        }

        /* ════════════════════════════════════════════════════════
           RESPONSIVE — 960px breakpoint: 3-col → 1-col
           ════════════════════════════════════════════════════════ */

        @media (max-width: 960px) {
          .sa-hero__grid {
            grid-template-columns: 1fr;
            gap: var(--s-10);
          }
          /* Order: copy (1) → seals (2) → widget (3) */
          .sa-story-col  { order: 1; }
          .sa-monument   { order: 2; }
          .sa-widget-col { order: 3; }

          /* Flat side-by-side seals on tablet */
          .sa-seal-inner {
            flex-direction: row;
            justify-content: center;
            gap: var(--s-6);
          }
        }

        /* 768px: disable 3D, keep layout flat */
        @media (max-width: 768px) {
          .sa-monument:hover .sa-seal-inner {
            transform: none;
          }
        }

        /* 480px: compact mobile layout */
        @media (max-width: 480px) {
          .sa-hero {
            padding-block: var(--s-10);
          }
          .sa-h1__en {
            font-size: 2.5rem;
          }
          .sa-ctas {
            flex-direction: column;
          }
          .sa-ctas .mk-btn {
            width: 100%;
            text-align: center;
            min-height: 44px;
            justify-content: center;
          }
          .sa-ambient {
            display: none;
          }
          .sa-stats {
            gap: var(--s-4);
          }
          .sa-stat__num {
            font-size: 1.1rem;
          }
          /* iOS zoom prevention */
          .mk-input,
          .mk-select {
            font-size: 16px !important;
          }
        }

      `}</style>

      <MkTicker />
      <MkNavbar />

      <main>

        {/* ══════════════════════════════════════════════════════════
            SECTION 1 — HERO
            Dark, full-viewport, 3-column: story | seals | widget
            ══════════════════════════════════════════════════════════ */}
        <section className="sa-hero mk-bg-dark" aria-labelledby="sa-headline">

          {/* Entry gradient line — gold → purple → gold */}
          <div className="sa-hero__top-border" aria-hidden="true" />

          {/* Ambient Kannada watermarks — atmosphere, never readable */}
          <span className="sa-ambient sa-ambient--nambike" aria-hidden="true">ನಂಬಿಕೆ</span>
          <span className="sa-ambient sa-ambient--vishvasa" aria-hidden="true">ವಿಶ್ವಾಸ</span>

          <div className="sa-hero__grid">

            {/* ── LEFT: Story copy ── */}
            <div className="sa-story-col reveal">

              {/* Bilingual overline pill */}
              <div className="sa-pill">
                <span className="sa-pill__kn" lang="kn">
                  ಕರ್ನಾಟಕದ ನಂಬಿಕೆಯ ಬ್ರ್ಯಾಂಡ್
                </span>
                <span className="sa-pill__en">Karnataka&apos;s Trusted Gold Buyer</span>
              </div>

              {/* Bilingual H1 — visual signature of this design */}
              <div className="sa-h1">
                <h1 className="sa-h1__en" id="sa-headline">Instant Money.</h1>
                <span className="sa-h1__kn" lang="kn">ತಕ್ಷಣ ಹಣ</span>
              </div>

              {/* Story body */}
              <p className="sa-hero-body">
                For 15 years, families across Karnataka have trusted MK Gold with one of the
                most personal financial decisions of their lives. No pressure. No judgment.
                Just fairness, transparency, and respect — every single time.
              </p>

              {/* CTAs */}
              <div className="sa-ctas">
                <MkButton variant="gold" href="/sell-gold" size="lg">
                  Sell Gold Today
                </MkButton>
                <MkButton variant="outline-light" href="/release-pledged-gold" size="lg">
                  Release Pledged Gold
                </MkButton>
              </div>

              {/* Micro-stats — Tanker number + Anek Kannada label */}
              <div className="sa-stats" role="list" aria-label="MK Gold at a glance">
                {HERO_STATS.map((stat) => (
                  <div key={stat.num} className="sa-stat" role="listitem">
                    <span className="sa-stat__num" lang="kn">{stat.num}</span>
                    <span className="sa-stat__label" lang="kn">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── MIDDLE: 3D Seal Monument ── */}
            <div
              className="sa-monument reveal delay-2"
              aria-label="MK Gold — MK Andare Nambike trust seals"
            >
              {/* Temple frame with 4 CSS corner marks */}
              <div className="sa-frame">
                {/* Bottom corners — spans because ::before/::after are taken */}
                <span className="sa-corner-bl" aria-hidden="true" />
                <span className="sa-corner-br" aria-hidden="true" />

                {/* 3D inner: rotates on hover via CSS */}
                <div className="sa-seal-inner">
                  <MkSeal variant="en" size="lg" animate />
                  <MkSeal variant="kn" size="lg" animate />
                </div>
              </div>

              {/* Caption below seals */}
              <div className="sa-monument__text">
                <span className="sa-monument__kn" lang="kn">MK ಅಂದರೆ ನಂಬಿಕೆ</span>
                <span className="sa-monument__en">MK Means Trust</span>
              </div>
            </div>

            {/* ── RIGHT: Live rate widget ── */}
            <div className="sa-widget-col reveal delay-3">
              <GoldRateProvider>
                <MkRateWidget variant="hero" />
              </GoldRateProvider>
              <p className="sa-widget-trust">
                MCX-linked rate&nbsp;&middot;&nbsp;Updated every 5 min&nbsp;&middot;&nbsp;No hidden deductions
              </p>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — BRAND STORY
            Narrow centred column, dark bg, left-border pillars
            ══════════════════════════════════════════════════════════ */}
        <section className="mk-bg-dark" aria-labelledby="sa-story-head">
          <div className="sa-brand-story">

            {/* Bilingual overline */}
            <p className="sa-brand-story__overline" id="sa-story-head">
              <span className="sa-brand-story__overline-kn" lang="kn">ನಮ್ಮ ಕಥೆ</span>
              <span className="sa-brand-story__overline-sep">· Our Story</span>
            </p>

            {/* Three left-border pillars */}
            {PILLARS.map((p, i) => (
              <div key={p.title} className={`sa-pillar reveal${i > 0 ? ` delay-${i}` : ''}`}>
                <h3 className="sa-pillar__title">{p.title}</h3>
                <p className="sa-pillar__body">{p.body}</p>
              </div>
            ))}

            {/* Pull-quote in Tanker — Kannada, gold */}
            <div className="sa-pullquote reveal delay-3">
              <span className="sa-pullquote__text" lang="kn">
                ನಂಬಿಕೆ ಒಂದೇ ನಮ್ಮ ತಳಪಾಯ.
              </span>
              <span className="sa-pullquote__trans">(Trust is our only foundation.)</span>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — HOW IT WORKS (mk-bg-light)
            MkSteps renders its own <section> with mk-bg-light
            ══════════════════════════════════════════════════════════ */}
        <MkSteps />

        {/* ══════════════════════════════════════════════════════════
            SECTION 4 — CTA CLOSE (mk-bg-purple)
            MkCtaBand renders its own <section>
            ══════════════════════════════════════════════════════════ */}
        <MkCtaBand />

      </main>

      <MkFooter />
    </>
  );
}
