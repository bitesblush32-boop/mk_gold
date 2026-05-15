import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkButton } from '@/components/ui/MkButton';
import { MkBadge } from '@/components/ui/MkBadge';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkTrust } from '@/components/sections/MkTrust';
import { MkFaq } from '@/components/sections/MkFaq';
import { getFaqsByPage } from '@/lib/db/faqs';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkCalculator } from '@/components/features/MkCalculator';
import { MkBranchFinder } from '@/components/features/MkBranchFinder';
import { MkEmergency } from '@/components/features/MkEmergency';
import { howToSchema } from '@/lib/schema/how-to';
import { HOW_TO_STEPS, GOLD_TYPES, PAYMENT_METHODS, REQUIRED_DOCS, NOT_NEEDED } from '@/lib/data/sell-gold';

/* ─── Metadata ────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Sell Gold | Best Rate Today | MK Gold Karnataka',
  description:
    'Sell gold at MK Gold. Live MCX rates, XRF purity test, payment in 30 minutes. 16 branches in Bangalore, Mysore, Mangalore & Davangere. Walk in today — no appointment needed.',
  alternates: { canonical: 'https://mkgold.in/sell-gold' },
  openGraph: {
    title: 'Sell Gold | Best Rate Today | MK Gold Karnataka',
    description:
      'Sell gold at live MCX rates. XRF purity test. Payment in 30 minutes. 16 branches across Karnataka. Trusted since 2014.',
    url: 'https://mkgold.in/sell-gold',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

/* ─── Schema data ─────────────────────────────────────────────── */

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Sell Gold for Instant Cash',
  description:
    'MK Gold buys gold jewellery, coins, and bars at live MCX rates. XRF purity test. Instant payment in 45 minutes. 16 branches across Karnataka.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'MK Gold',
    url: 'https://mkgold.in',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
  },
  areaServed: { '@type': 'State', name: 'Karnataka' },
  serviceType: 'Gold Buying',
  offers: {
    '@type': 'Offer',
    description: '97.5% of live MCX gold rate',
  },
};

/* ─── Page ────────────────────────────────────────────────────── */

export default async function SellGoldPage() {
  const faqs = await getFaqsByPage('general');
  const howToJson = howToSchema(
    HOW_TO_STEPS,
    'How to Sell Gold at MK Gold',
    'Step-by-step guide to selling gold at MK Gold — from walk-in to payment in 45 minutes.',
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJson) }}
      />

      <MkNavbar />

      {/* ── 1. HERO ─────────────────────────────────────────────── */}
      <section className="mk-bg-dark section">
        <div className="mk-container">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-xs)',
              color: 'rgba(255,255,255,0.45)',
              marginBottom: '2.5rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <a href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              Home
            </a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
            <span style={{ color: 'var(--gold)' }}>Sell Gold</span>
          </nav>

          <div style={{ maxWidth: '760px' }}>
            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <MkBadge variant="gold">Est. 2014</MkBadge>
              <MkBadge variant="gold">16 Branches</MkBadge>
              <MkBadge variant="gold">XRF Certified</MkBadge>
              <MkBadge variant="gold">ISO 9001:2015</MkBadge>
            </div>

            <h1
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                lineHeight: 1.1,
                margin: '0 0 1.25rem',
              }}
            >
              Sell Your Gold at{' '}
              <span style={{ color: 'var(--gold)' }}>Live MCX Rates</span>
            </h1>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.7)',
                margin: '0 0 2rem',
                lineHeight: 1.65,
                maxWidth: '600px',
              }}
            >
              XRF purity test. Transparent pricing. Payment in 45 minutes.
              Walk in at any of our 16 branches — no appointment needed.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <MkButton variant="gold" size="lg" href="/contact">
                Book Free Valuation
              </MkButton>
              <MkButton variant="outline-light" size="lg" href="#rate">
                See Today&apos;s Rate
              </MkButton>
            </div>

            {/* Quick stats */}
            <div
              style={{
                display: 'flex',
                gap: '2.5rem',
                flexWrap: 'wrap',
                paddingTop: '1.75rem',
                borderTop: '1px solid rgba(223,193,96,0.18)',
              }}
            >
              {[
                { n: '45 min', l: 'Avg. payout time' },
                { n: '97.5%', l: 'Of MCX rate paid' },
                { n: '10,000+', l: 'Customers served' },
              ].map(({ n, l }) => (
                <div key={n}>
                  <div
                    style={{
                      fontFamily: 'Tanker, serif',
                      fontSize: 'var(--t-h3)',
                      color: 'var(--gold)',
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'var(--t-xs)',
                      color: 'rgba(255,255,255,0.5)',
                      marginTop: '0.25rem',
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LIVE RATE + CALCULATOR ───────────────────────────── */}
      <section className="mk-bg-light section" id="rate">
        <div className="mk-container">
          <MkSectionHeader
            tag="Live Rate"
            title="Today's Gold Rate"
            accentWord="Gold"
            subtitle="Updated every 5 minutes from MCX. What you see is what you get."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            <MkRateWidget variant="page" />
            <MkCalculator />
          </div>

          {/* MCX transparency row */}
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1.25rem 1.5rem',
              background: 'white',
              borderRadius: 'var(--r-lg)',
              border: '1px solid var(--gallery-dk)',
            }}
          >
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-xs)',
                fontWeight: 700,
                color: 'var(--mist)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 0.25rem',
              }}
            >
              How your rate is calculated
            </p>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-sm)',
                color: 'var(--ink-mid)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Live MCX rate &times; weight (grams) &times; purity factor &times; 97.5% = your payment.
              Our 2.5% margin is shown openly next to the MCX rate — always.
            </p>
          </div>
        </div>
      </section>

      {/* ── 3. WHAT WE BUY ──────────────────────────────────────── */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <MkSectionHeader
            tag="What We Buy"
            title="All Types of Gold"
            accentWord="Gold"
            subtitle="22K and 24K — any type, any age, any condition."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            {GOLD_TYPES.map((type, i) => (
              <div
                key={type.title}
                className={`mk-card reveal delay-${i + 1}`}
              >
                <h3
                  style={{
                    fontFamily: 'Tanker, serif',
                    fontSize: 'var(--t-h4)',
                    color: 'var(--plum)',
                    margin: '0 0 0.75rem',
                  }}
                >
                  {type.title}
                </h3>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.375rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.875rem',
                  }}
                >
                  {type.purities.map((p) => (
                    <MkBadge key={p} variant="gold">{p}</MkBadge>
                  ))}
                </div>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {type.desc}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-sm)',
              color: 'var(--mist)',
              textAlign: 'center',
              marginTop: '1.5rem',
              margin: '1.5rem 0 0',
            }}
          >
            We do not buy gold-plated or gold-filled jewellery.
          </p>
        </div>
      </section>

      {/* ── 4. 6-STEP PROCESS ───────────────────────────────────── */}
      <MkSteps />

      {/* ── Emergency callout ───────────────────────────────────── */}
      <MkEmergency />

      {/* ── 5. DOCUMENTS ────────────────────────────────────────── */}
      <section className="mk-bg-dark section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Documents"
            title="What to Bring"
            dark
            subtitle="The paperwork is minimal. You need exactly one document."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginTop: '3rem',
            }}
          >
            {/* Required — gold border */}
            <div
              style={{
                padding: '2rem',
                background: 'rgba(223,193,96,0.06)',
                borderRadius: 'var(--r-xl)',
                borderLeft: '3px solid var(--gold)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-xs)',
                  fontWeight: 700,
                  color: 'var(--gold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 1.25rem',
                }}
              >
                Bring one of these
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {REQUIRED_DOCS.map((doc) => (
                  <li
                    key={doc}
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'var(--t-sm)',
                      color: 'rgba(255,255,255,0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        background: 'var(--gold)',
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: 'var(--plum)',
                      }}
                    >
                      ✓
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Not required */}
            <div
              style={{
                padding: '2rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--r-xl)',
                borderLeft: '3px solid rgba(255,255,255,0.1)',
              }}
            >
              <h3
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-xs)',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.4)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 1.25rem',
                }}
              >
                Not required
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {NOT_NEEDED.map((item) => (
                  <li
                    key={item}
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'var(--t-sm)',
                      color: 'rgba(255,255,255,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        width: '1.25rem',
                        height: '1.25rem',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        flexShrink: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: '0.75rem',
                        color: 'rgba(255,255,255,0.2)',
                      }}
                    >
                      &ndash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. PAYMENT METHODS ──────────────────────────────────── */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Payment"
            title="Get Paid Your Way"
            accentWord="Paid"
            subtitle="Choose how you receive your money. All payments are made on the spot."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            {PAYMENT_METHODS.map((pm, i) => (
              <div
                key={pm.method}
                className={`mk-card reveal delay-${i + 1}`}
              >
                <div
                  style={{
                    fontFamily: 'Tanker, serif',
                    fontSize: 'var(--t-h3)',
                    color: 'var(--plum)',
                    marginBottom: '0.25rem',
                  }}
                >
                  {pm.method}
                </div>
                <div
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-xs)',
                    fontWeight: 700,
                    color: 'var(--gold-deep)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginBottom: '0.75rem',
                  }}
                >
                  {pm.limit}
                </div>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {pm.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. TRUST ────────────────────────────────────────────── */}
      <MkTrust />

      {/* ── 8. BRANCH FINDER ────────────────────────────────────── */}
      <MkBranchFinder />

      {/* ── 9. FAQ ──────────────────────────────────────────────── */}
      <MkFaq variant="sell-gold" faqs={faqs} />

      {/* ── 10. CTA BAND ────────────────────────────────────────── */}
      <MkCtaBand />

      <MkFooter />
    </>
  );
}
