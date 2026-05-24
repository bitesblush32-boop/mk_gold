import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';
import { GoldCalculatorUnlocked } from '@/components/sections/GoldCalculatorSection';
import { MkCtaBand } from '@/components/sections/MkCtaBand';

export const metadata: Metadata = {
  title: 'Gold Value Calculator | MK Gold Karnataka',
  description:
    'Calculate the exact value of your gold. MK Gold offers transparent pricing based on live rates, XRF purity testing, and instant cash payment across Karnataka.',
  alternates: { canonical: 'https://mkgold.in/plan' },
  robots: { index: true, follow: true },
};

export default function PlanPage() {
  return (
    <>
      <MkNavbar />

      {/* Hero */}
      <section
        className="mk-bg-dark section"
        style={{ paddingTop: 'calc(var(--chrome-h) + var(--s-8))', paddingBottom: 'var(--s-8)' }}
      >
        <div className="mk-container" style={{ maxWidth: '680px', textAlign: 'center' }}>
          <p className="mk-section-overline" style={{ marginBottom: 'var(--s-2)' }}>
            Gold Value Estimator
          </p>
          <h1
            className="t-h1"
            style={{ margin: '0 0 var(--s-3)', lineHeight: 1.05 }}
          >
            Calculate Your Gold Value
          </h1>
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-lg)',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Get an instant, accurate estimate for your gold — based on the MK Gold buying rate,
            your purity, and weight. No obligation, just clarity.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="mk-bg-dark section--sm" style={{ paddingBottom: 'var(--s-12)' }}>
        <div className="mk-container">
          <GoldCalculatorUnlocked />
        </div>
      </section>

      {/* Trust points */}
      <section className="mk-bg-light section--sm">
        <div className="mk-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--s-5)',
            }}
          >
            {[
              { num: '97.5%', label: 'of MCX rate paid to you' },
              { num: '30 min', label: 'payment after XRF test' },
              { num: '16+', label: 'branches across Karnataka' },
            ].map(({ num, label }) => (
              <div
                key={num}
                style={{
                  textAlign: 'center',
                  padding: 'var(--s-5) var(--s-4)',
                  borderRadius: 'var(--r-lg)',
                  background: 'white',
                  border: '1px solid var(--gallery-dk)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Tanker, serif',
                    fontSize: 'var(--t-h2)',
                    color: 'var(--plum)',
                    margin: '0 0 var(--s-1)',
                    lineHeight: 1,
                  }}
                >
                  {num}
                </p>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    margin: 0,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MkCtaBand />
      <MkFooter />
    </>
  );
}
