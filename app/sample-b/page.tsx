import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkFaq } from '@/components/sections/MkFaq';
import { GoldRateProvider } from '@/context/GoldRateContext';

/* ─── Metadata ───────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Sample B — Transparent Gold | MK Gold',
};

/* ─── Data ───────────────────────────────────────────────────── */

const MILESTONES = [
  { year: '2014', event: 'First Branch',   detail: 'Basaveshwaranagar, Bangalore'   },
  { year: '2016', event: 'XRF Certified',  detail: 'German spectrometer introduced' },
  { year: '2019', event: 'ISO 9001:2015',  detail: 'Quality management certified'   },
  { year: '2022', event: 'Karnataka-wide', detail: 'Mysore, Mangalore, Davangere'   },
  { year: '2026', event: '16 Branches',    detail: "Karnataka's most trusted buyer" },
] as const;

const PILLARS = [
  {
    num:   '01',
    title: 'Visible Testing',
    body:  'Your gold is tested on a German XRF spectrometer in front of you. The exact purity and weight are shown on screen. You see the number before we do.',
    kn:    'ಪರೀಕ್ಷೆ ನಿಮ್ಮ ಮುಂದೆ.',
  },
  {
    num:   '02',
    title: 'Fair Rate, No Negotiation',
    body:  'We pay 97.5% of the live MCX gold rate. The MCX rate and our margin are displayed side by side. There is no bargaining because the price is already fair.',
    kn:    'ದರ ನ್ಯಾಯಯುತ, ಯಾವಾಗಲೂ.',
  },
  {
    num:   '03',
    title: 'Dignified Experience',
    body:  'Selling gold is often an emotionally difficult decision. We ensure every customer feels respected, informed and unhurried — regardless of the quantity.',
    kn:    'ಗೌರವ ಮೊದಲು, ವ್ಯಾಪಾರ ನಂತರ.',
  },
] as const;

/* ─── Page ───────────────────────────────────────────────────── */

export default function SampleBPage() {
  return (
    <>
      {/* ── Page-scoped styles ────────────────────────────────── */}
      <style>{`

        /* ════════════════════════════════════════════════════════
           HERO — editorial light, gallery background, no pattern
           ════════════════════════════════════════════════════════ */

        .sb-hero {
          position: relative;
          /*
           * Two CSS background layers stacked:
           *   Layer 1 (top)    — gold gradient overlay, transparent over the image
           *   Layer 2 (bottom) — the jewellery JPG, cover-fitted
           * background-color is the fallback while the image loads.
           */
          background-color: var(--gold-deep);
          background-image:
            linear-gradient(
              105deg,
              rgba(223, 193, 96, 0.72) 0%,
              rgba(223, 193, 96, 0.60) 50%,
              rgba(223, 193, 96, 0.42) 100%
            ),
            url('/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg');
          background-size: cover;
          background-position: center 30%;
          background-repeat: no-repeat;
          min-height: calc(100dvh - var(--chrome-h));
          display: flex;
          align-items: center;
          /* Diagonal bottom clip: left stays full, right raised 48px */
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 48px), 0 100%);
          padding-block: var(--s-20) calc(var(--s-20) + 48px);
          overflow: hidden;
        }

        /* Single 1px gold precision entry line — top of hero */
        .sb-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(223, 193, 96, 0.9);
          z-index: 1;
          pointer-events: none;
        }

        /* Two-column hero grid: 55% copy | 45% right panel */
        .sb-hero__grid {
          width: 100%;
          max-width: var(--max-w);
          margin-inline: auto;
          padding-inline: var(--pad-x);
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: var(--s-14);
          align-items: center;
          position: relative;
          z-index: 1;
        }

        /* ── Left column: copy ── */

        .sb-hero-copy {
          position: relative;
          /* Space for the vertical gold rule */
          padding-left: var(--s-8);
          display: flex;
          flex-direction: column;
          gap: var(--s-5);
        }

        /* Vertical plum rule — punches through the golden background */
        .sb-hero-copy::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: var(--plum);
        }

        /* Editorial sequence — white on gold bg */
        .sb-hero-meta {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.80);
          line-height: 1;
        }

        /* Bilingual H1 — the design signature */
        .sb-h1 {
          display: flex;
          flex-direction: column;
          gap: 0;
          margin: 0;
        }
        /* English line: deep plum — crisp against warm gold */
        .sb-h1__en {
          display: block;
          font-family: 'Tanker', serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          color: var(--plum-deep);
          line-height: 1.0;
          letter-spacing: -0.02em;
        }
        /* Kannada line: white — pops off the golden amber background */
        .sb-h1__kn {
          display: block;
          font-family: 'Anek Kannada', sans-serif;
          font-size: clamp(2.8rem, 6vw, 5.5rem);
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        /* Subheadline — deep ink, readable on warm gold */
        .sb-hero-sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-lg);
          font-weight: 400;
          color: var(--ink);
          max-width: 40ch;
          line-height: var(--lh-relaxed);
        }

        /* Kannada trust phrase block */
        .sb-hero-kn {
          display: flex;
          flex-direction: column;
          gap: var(--s-1);
        }
        .sb-hero-kn__phrase {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-sm);
          color: var(--plum-deep);
          line-height: 1.5;
          font-style: normal;
          font-weight: 600;
        }
        .sb-hero-kn__trans {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(59, 24, 72, 0.70);
        }

        /* CTA row */
        .sb-hero-ctas {
          display: flex;
          gap: var(--s-4);
          flex-wrap: wrap;
          margin-top: var(--s-3);
        }
        .sb-hero-ctas .mk-btn {
          min-height: 48px;
        }

        /* Inline trust signals — white on gold */
        .sb-trust-signals {
          display: flex;
          align-items: center;
          gap: var(--s-3);
          flex-wrap: wrap;
        }
        .sb-trust-signals__item {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
        }
        .sb-trust-signals__dot {
          color: var(--plum);
          font-size: var(--t-sm);
          user-select: none;
          flex-shrink: 0;
        }

        /* ── Right column: rate panel card ── */

        .sb-right-panel {
          background: var(--white);
          border-radius: var(--r-2xl);
          border: 1.5px solid var(--gallery-dk);
          padding: var(--s-8);
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          gap: var(--s-6);
          will-change: transform;
          transition: box-shadow var(--t-base), transform var(--t-base);
        }
        .sb-right-panel:hover {
          box-shadow: var(--shadow-lg);
          transform: translateY(-2px);
        }

        /* Strip the widget's own box — panel card provides the container */
        .sb-right-panel .mk-rate-widget--page {
          background: transparent;
          border: none;
          box-shadow: none;
          border-radius: 0;
          max-width: none;
          padding: 0;
          will-change: auto;
        }

        /* Gold divider between widget and seal */
        .sb-panel-divider {
          height: 1px;
          background: rgba(223, 193, 96, 0.30);
          border: none;
          margin: 0;
        }

        /* Seal area */
        .sb-seal-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--s-2);
        }
        .sb-seal-area__label {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          font-weight: 500;
          color: var(--plum);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-align: center;
        }
        .sb-seal-area__kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-sm);
          color: var(--plum);
          text-align: center;
        }

        /* ════════════════════════════════════════════════════════
           LEGACY TIMELINE
           ════════════════════════════════════════════════════════ */

        .sb-timeline-header {
          text-align: center;
          margin-bottom: var(--s-12);
        }
        .sb-timeline-title {
          font-family: 'Tanker', serif;
          font-size: var(--t-h2);
          color: var(--plum);
          line-height: var(--lh-snug);
          margin: 0;
        }

        /* Scroll container — thin scrollbar on desktop */
        .sb-timeline-scroll {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(223, 193, 96, 0.35) transparent;
          padding-bottom: var(--s-4);
        }
        .sb-timeline-scroll::-webkit-scrollbar {
          height: 3px;
        }
        .sb-timeline-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sb-timeline-scroll::-webkit-scrollbar-thumb {
          background: rgba(223, 193, 96, 0.35);
          border-radius: 99px;
        }

        /* Flex row of milestones — min-width forces scroll when needed */
        .sb-timeline-track {
          display: flex;
          gap: var(--s-8);
          position: relative;
          min-width: max-content;
          padding-inline: var(--s-4);
          align-items: flex-start;
        }

        /* Horizontal connecting line between node circles */
        .sb-timeline-track::before {
          content: '';
          position: absolute;
          top: 24px; /* half of 48px circle */
          /* Align to circle centers: ~80px offset from each edge */
          left: calc(var(--s-4) + 80px);
          right: calc(var(--s-4) + 80px);
          height: 1px;
          background: rgba(223, 193, 96, 0.40);
          z-index: 0;
        }

        /* Individual milestone node */
        .sb-milestone {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 160px;
          text-align: center;
          position: relative;
          z-index: 1;
          gap: var(--s-2);
        }

        .sb-milestone__circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid var(--gold);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Tanker', serif;
          font-size: 0.875rem;
          color: var(--plum);
          flex-shrink: 0;
          transition: background-color var(--t-base), border-color var(--t-base);
        }
        .sb-milestone:hover .sb-milestone__circle {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--plum);
        }

        .sb-milestone__event {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          font-weight: 700;
          color: var(--plum);
          display: block;
        }

        .sb-milestone__detail {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: var(--mist);
          line-height: 1.35;
          max-width: 140px;
          display: block;
        }

        /* ════════════════════════════════════════════════════════
           TRANSPARENCY PILLARS
           ════════════════════════════════════════════════════════ */

        .sb-pillars-header {
          text-align: center;
          margin-bottom: var(--s-12);
        }
        .sb-pillars-title {
          font-family: 'Tanker', serif;
          font-size: var(--t-h2);
          color: var(--plum);
          margin: 0;
        }

        .sb-pillars-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--s-6);
        }

        /* Pillar card — uses mk-card mk-card--gold-border + this */
        .sb-pillar {
          padding: var(--s-8);
          display: flex;
          flex-direction: column;
          gap: var(--s-3);
        }

        /* Large ghost number — decorative anchor */
        .sb-pillar__num {
          font-family: 'Tanker', serif;
          font-size: 4rem;
          color: var(--gold);
          opacity: 0.18;
          line-height: 1;
          letter-spacing: -0.02em;
          display: block;
          margin-bottom: var(--s-1);
        }

        .sb-pillar__title {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-h4);
          font-weight: 600;
          color: var(--plum);
          margin: 0;
          line-height: var(--lh-snug);
        }

        .sb-pillar__body {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--ink-mid);
          line-height: var(--lh-relaxed);
          flex: 1;
          margin: 0;
        }

        /* Kannada phrase — pinned to card bottom via margin-top auto */
        .sb-pillar__kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: var(--t-xs);
          color: rgba(81, 37, 97, 0.60);
          margin-top: auto;
          padding-top: var(--s-4);
          border-top: 1px solid var(--gallery-dk);
          line-height: 1.4;
        }

        /* ════════════════════════════════════════════════════════
           RESPONSIVE — 960px: 2-col hero → 1-col
           ════════════════════════════════════════════════════════ */

        @media (max-width: 960px) {
          /* Remove diagonal clip on mobile — flat edge */
          .sb-hero {
            clip-path: none;
            padding-block: var(--s-14) var(--s-12);
          }

          .sb-hero__grid {
            grid-template-columns: 1fr;
            gap: var(--s-10);
          }

          /* Order: copy first, panel second */
          .sb-hero-copy  { order: 1; }
          .sb-right-panel { order: 2; }

          /* Replace vertical rule with horizontal top rule on mobile */
          .sb-hero-copy::before {
            width: 100%;
            height: 3px;
            top: 0;
            left: 0;
            bottom: auto;
          }
          .sb-hero-copy {
            padding-left: 0;
            padding-top: var(--s-5);
          }

          /* Rate widget full width in panel */
          .sb-right-panel {
            border-radius: var(--r-xl);
          }
        }

        /* 768px: timeline goes vertical */
        @media (max-width: 768px) {
          .sb-timeline-scroll {
            overflow-x: hidden;
          }
          .sb-timeline-track {
            flex-direction: column;
            min-width: auto;
            align-items: flex-start;
            padding-inline: 0;
            gap: var(--s-6);
          }
          /* Replace horizontal line with vertical */
          .sb-timeline-track::before {
            top: 24px;
            left: 24px; /* center of 48px circle */
            right: auto;
            width: 1px;
            height: calc(100% - 24px);
            background: rgba(223, 193, 96, 0.40);
          }
          .sb-milestone {
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
            min-width: auto;
            gap: var(--s-4);
          }
          .sb-milestone__circle {
            flex-shrink: 0;
          }
          .sb-milestone__event,
          .sb-milestone__detail {
            text-align: left;
          }
          .sb-milestone__detail {
            max-width: none;
          }
        }

        /* 640px: pillars 3-col → 1-col */
        @media (max-width: 640px) {
          .sb-pillars-grid {
            grid-template-columns: 1fr;
          }
        }

        /* 375px mobile touch targets + full-width CTAs */
        @media (max-width: 480px) {
          .sb-hero-sub {
            font-size: var(--t-base);
          }
          .sb-hero-ctas {
            flex-direction: column;
          }
          .sb-hero-ctas .mk-btn {
            width: 100%;
            justify-content: center;
            min-height: 48px;
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
            Light editorial: gallery bg, plum text, gold as structure
            ══════════════════════════════════════════════════════════ */}
        <section className="sb-hero" aria-labelledby="sb-headline">

          <div className="sb-hero__grid">

            {/* ── LEFT: Headline architecture ── */}
            <div className="sb-hero-copy reveal">

              {/* Editorial sequence above H1 */}
              <p className="sb-hero-meta" aria-label="Brand context">
                Karnataka&nbsp;&middot;&nbsp;2014 – 2026&nbsp;&middot;&nbsp;16 Branches
              </p>

              {/* Bilingual H1 — the design signature */}
              <h1 className="sb-h1" id="sb-headline">
                <span className="sb-h1__en">Instant Money.</span>
                <span className="sb-h1__kn" lang="kn">ತಕ್ಷಣ ಹಣ.</span>
              </h1>

              {/* Subheadline */}
              <p className="sb-hero-sub">
                Karnataka&apos;s most trusted gold buyer. Transparent evaluation, fair value,
                and a dignified experience — backed by 15 years of trust.
              </p>

              {/* Kannada trust phrase */}
              <div className="sb-hero-kn">
                <span className="sb-hero-kn__phrase" lang="kn">
                  ನ್ಯಾಯಯುತ ದರ. ತಕ್ಷಣ ಪಾವತಿ. ಯಾವುದೇ ಮೋಸವಿಲ್ಲ.
                </span>
                <span className="sb-hero-kn__trans">
                  (Fair rate. Instant payment. No deception.)
                </span>
              </div>

              {/* CTAs — plum on light bg, deliberate reversal from Sample A */}
              <div className="sb-hero-ctas">
                <MkButton variant="plum" href="/sell-gold" size="lg">
                  Sell Gold Today
                </MkButton>
                <MkButton variant="outline-plum" href="/contact" size="lg">
                  Find Nearest Branch
                </MkButton>
              </div>

              {/* Inline trust signals with gold separators */}
              <div className="sb-trust-signals" aria-label="Certifications">
                <span className="sb-trust-signals__item">ISO 9001:2015</span>
                <span className="sb-trust-signals__dot" aria-hidden="true">·</span>
                <span className="sb-trust-signals__item">German XRF Test</span>
                <span className="sb-trust-signals__dot" aria-hidden="true">·</span>
                <span className="sb-trust-signals__item">Payment in 45 min</span>
              </div>

            </div>

            {/* ── RIGHT: Rate panel + Seal (white card) ── */}
            <div className="sb-right-panel reveal delay-2">

              {/* Rate widget — stripped of its own card shell within the panel */}
              <GoldRateProvider>
                <MkRateWidget variant="page" />
              </GoldRateProvider>

              {/* Gold horizontal rule divider */}
              <hr className="sb-panel-divider" />

              {/* Seal + text */}
              <div className="sb-seal-area">
                <MkSeal variant="en" size="md" />
                <span className="sb-seal-area__label">MK Andare Nambike</span>
                <span className="sb-seal-area__kn" lang="kn">MK ಅಂದರೆ ನಂಬಿಕೆ</span>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 2 — LEGACY TIMELINE
            15 years of quiet trust, visualised as milestones
            ══════════════════════════════════════════════════════════ */}
        <section
          className="section"
          style={{ backgroundColor: 'var(--white)' }}
          aria-labelledby="sb-timeline-head"
        >
          <div className="mk-container">

            <div className="sb-timeline-header reveal">
              <p className="mk-section-overline">
                <span lang="kn">ನಮ್ಮ ಪಯಣ</span> · Our Journey
              </p>
              <h2 className="sb-timeline-title" id="sb-timeline-head">
                15 Years of Quiet Trust
              </h2>
            </div>

            {/* Horizontal scrollable on desktop, vertical on mobile */}
            <div className="sb-timeline-scroll reveal delay-1">
              <div className="sb-timeline-track" role="list" aria-label="MK Gold milestones">

                {MILESTONES.map((m) => (
                  <div key={m.year} className="sb-milestone" role="listitem">
                    <div className="sb-milestone__circle" aria-hidden="true">
                      {m.year}
                    </div>
                    <strong className="sb-milestone__event">{m.event}</strong>
                    <span className="sb-milestone__detail">{m.detail}</span>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 3 — TRANSPARENCY PILLARS
            3 editorial cards: visible testing, fair rate, dignity
            ══════════════════════════════════════════════════════════ */}
        <section className="mk-bg-light section" aria-labelledby="sb-pillars-head">
          <div className="mk-container">

            <div className="sb-pillars-header reveal">
              <p className="mk-section-overline">Why MK Gold</p>
              <h2 className="sb-pillars-title" id="sb-pillars-head">
                Nothing Hidden. Everything Shown.
              </h2>
            </div>

            <div className="sb-pillars-grid">
              {PILLARS.map((p, i) => (
                <article
                  key={p.num}
                  className={`mk-card mk-card--gold-border sb-pillar reveal delay-${i + 1}`}
                  aria-labelledby={`sb-pillar-${p.num}`}
                >
                  <span className="sb-pillar__num" aria-hidden="true">{p.num}</span>
                  <h3 className="sb-pillar__title" id={`sb-pillar-${p.num}`}>
                    {p.title}
                  </h3>
                  <p className="sb-pillar__body">{p.body}</p>
                  <p className="sb-pillar__kn" lang="kn">{p.kn}</p>
                </article>
              ))}
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            SECTION 4 — HOW IT WORKS (MkSteps owns its own section)
            ══════════════════════════════════════════════════════════ */}
        <MkSteps />

        {/* ══════════════════════════════════════════════════════════
            SECTION 5 — FAQ (MkFaq owns its own section)
            ══════════════════════════════════════════════════════════ */}
        <MkFaq />

      </main>

      <MkFooter />
    </>
  );
}
