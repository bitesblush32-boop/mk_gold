import type { Metadata } from 'next';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkButton } from '@/components/ui/MkButton';
import { MkBadge } from '@/components/ui/MkBadge';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { MkTrustBlock } from '@/components/ui/MkTrustBlock';
import { MkPledgedCalculator } from '@/components/features/MkPledgedCalculator';
import { MkPledgedFaq } from '@/components/sections/MkPledgedFaq';

/* ─── Metadata ────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Release Pledged Gold | Confidential Help | MK Gold Karnataka',
  description:
    'We help you release gold pledged at banks and NBFCs across Karnataka. We pay the lender directly in front of you. Confidential, dignified service. 16 branches.',
  alternates: { canonical: 'https://mkgold.in/release-pledged-gold' },
  openGraph: {
    title: 'Release Pledged Gold | Confidential Help | MK Gold',
    description:
      'We pay your lender directly. You receive the difference. Confidential service across 16 branches in Karnataka. Trusted since 2014.',
    url: 'https://mkgold.in/release-pledged-gold',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

/* ─── Schema ──────────────────────────────────────────────────── */

const SERVICE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Pledged Gold Release',
  description:
    'MK Gold helps customers release gold pledged at banks and NBFCs. We pay the lender directly in front of the customer and purchase the gold immediately. Confidential service across Karnataka.',
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
  serviceType: 'Pledged Gold Release',
};

/* ─── Static data ─────────────────────────────────────────────── */

const HOW_IT_WORKS = [
  {
    n: '1',
    title: 'Share your loan details',
    desc: 'Tell us the outstanding loan amount, the name of your lender, and the branch. We handle everything from there. Nothing is shared with anyone without your consent.',
  },
  {
    n: '2',
    title: 'We visit the lender together',
    desc: 'We go to your lender\'s branch with you. The outstanding amount is paid directly to the lender, in your presence. You see every transaction happen.',
  },
  {
    n: '3',
    title: 'Your gold is released',
    desc: 'The lender releases your gold to you. We then complete our purchase and you receive the balance — the difference between the gold\'s value and your outstanding loan.',
  },
];

const LENDERS = [
  'SBI', 'ICICI Bank', 'HDFC Bank', 'Axis Bank', 'Kotak Mahindra',
  'Muthoot Finance', 'Manappuram Finance', 'IIFL Finance',
  'Federal Bank', 'South Indian Bank', 'Karnataka Bank', 'Canara Bank',
  'Union Bank', 'Bank of Baroda', 'Indian Bank', 'Ujjivan',
  'All local NBFCs',
];

const PAYMENT_METHODS = [
  {
    method: 'Cash',
    limit: 'Up to ₹1,99,999',
    detail: 'Counted in front of you. Ready immediately on acceptance.',
  },
  {
    method: 'NEFT / RTGS',
    limit: 'No upper limit',
    detail: 'Bank transfer for larger amounts. Credited within 2 hours.',
  },
  {
    method: 'UPI',
    limit: 'Up to ₹1,00,000',
    detail: 'Instant transfer to any UPI ID. Works with all UPI apps.',
  },
] as const;

/* ─── Page ────────────────────────────────────────────────────── */

export default function PledgedGoldPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_SCHEMA) }}
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
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '2.5rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              Home
            </a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ color: 'var(--gold)' }}>Release Pledged Gold</span>
          </nav>

          <div style={{ maxWidth: '720px' }}>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <MkBadge variant="gold">Confidential</MkBadge>
              <MkBadge variant="gold">16 Branches</MkBadge>
              <MkBadge variant="gold">Same Day</MkBadge>
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
              Release Your{' '}
              <span style={{ color: 'var(--gold)' }}>Pledged Gold</span>
            </h1>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.65,
                margin: '0 0 2rem',
                maxWidth: '580px',
              }}
            >
              We pay your lender directly. You receive the difference.
              The process is confidential.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <MkButton variant="gold" size="lg" href="/contact">
                Get Help Today
              </MkButton>
              <MkButton variant="outline-light" size="lg" href="tel:+918000000001">
                Call a Branch
              </MkButton>
            </div>

            {/* Confidential note */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--gold)',
                  flexShrink: 0,
                  opacity: 0.7,
                }}
              />
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-xs)',
                  color: 'rgba(223,193,96,0.65)',
                  margin: 0,
                }}
              >
                This enquiry is private. We do not share your details with anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. HOW IT WORKS (3 steps) ───────────────────────────── */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <MkSectionHeader
            tag="How It Works"
            title="Three steps. Done."
            accentWord="Three"
            subtitle="We guide you through every part of the process."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '0',
              marginTop: '3.5rem',
              position: 'relative',
            }}
          >
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.n}
                className="reveal"
                style={{
                  padding: '0 2rem 2rem',
                  textAlign: 'center',
                  position: 'relative',
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                {/* Connector line (between steps, not after last) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '2.25rem',
                      right: '-1px',
                      width: '2rem',
                      height: '1px',
                      background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)',
                      opacity: 0.3,
                    }}
                  />
                )}

                {/* Circle */}
                <div
                  style={{
                    width: '4rem',
                    height: '4rem',
                    borderRadius: '50%',
                    background: 'var(--plum)',
                    border: '2px solid rgba(223,193,96,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Tanker, serif',
                      fontSize: '1.5rem',
                      color: 'var(--gold)',
                      lineHeight: 1,
                    }}
                  >
                    {step.n}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-h4)',
                    fontWeight: 600,
                    color: 'var(--plum)',
                    margin: '0 0 0.75rem',
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Consent note */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-sm)',
              color: 'var(--mist)',
              textAlign: 'center',
              marginTop: '2.5rem',
            }}
          >
            Nothing is done without your knowledge or consent.
          </p>
        </div>
      </section>

      {/* ── 3. SUPPORTED LENDERS ────────────────────────────────── */}
      <section style={{ background: 'white' }} className="section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Lenders We Work With"
            title="We've done this before"
            accentWord="done"
            subtitle="We have worked with most banks and NBFCs across Karnataka."
          />

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem 1.5rem',
              justifyContent: 'center',
              marginTop: '3rem',
            }}
          >
            {LENDERS.map((lender) => (
              <span
                key={lender}
                className="reveal"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  fontWeight: 600,
                  color: 'var(--plum)',
                  padding: '0.5rem 1.125rem',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(81,37,97,0.18)',
                  background: 'rgba(81,37,97,0.04)',
                  whiteSpace: 'nowrap',
                }}
              >
                {lender}
              </span>
            ))}
          </div>

          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-sm)',
              color: 'var(--ink-mid)',
              textAlign: 'center',
              marginTop: '2rem',
            }}
          >
            Don&apos;t see your lender?{' '}
            <a
              href="https://wa.me/918000000001"
              style={{ color: 'var(--plum)', fontWeight: 600, textDecoration: 'underline' }}
            >
              Call us
            </a>
            {' '}— we likely work with them.
          </p>
        </div>
      </section>

      {/* ── 4. PAYOUT CALCULATOR ────────────────────────────────── */}
      <section className="mk-bg-dark section" id="calculator">
        <div className="mk-container">
          <MkSectionHeader
            tag="Estimate Your Payout"
            title="What will you receive?"
            dark
            subtitle="Enter your loan details and gold weight to see an estimate."
          />
          <MkPledgedCalculator />
        </div>
      </section>

      {/* ── 5. TRUST STATEMENTS ─────────────────────────────────── */}
      <section className="mk-bg-dark section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Our Promise"
            title="How we protect you"
            dark
            subtitle="Four things we commit to on every pledged gold release."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            <MkTrustBlock className="reveal">
              We pay the lender directly in front of you. No money changes hands without your presence and approval.
            </MkTrustBlock>

            <MkTrustBlock className="reveal delay-1">
              ISO 9001:2015 certified process. The same standards as our standard gold buying service — no shortcuts.
            </MkTrustBlock>

            <MkTrustBlock className="reveal delay-2">
              Private consultation available at all 16 branches. You do not need to discuss your situation in an open area.
            </MkTrustBlock>

            <MkTrustBlock className="reveal delay-3">
              No judgment. This is a financial service, not a moral evaluation. We treat every customer with the same dignity.
            </MkTrustBlock>
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
            subtitle="Your net payout is transferred immediately, on the same visit."
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
                className="mk-card mk-card--gallery reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
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

      {/* ── 7. FAQ ──────────────────────────────────────────────── */}
      <MkPledgedFaq />

      {/* ── 8. CTA BAND ─────────────────────────────────────────── */}
      <section className="mk-bg-dark section" aria-labelledby="pledged-cta-headline">
        <div className="mk-container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>

            <p className="mk-section-overline">We Are Here</p>

            <h2
              id="pledged-cta-headline"
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--white)',
                lineHeight: 1.2,
                margin: '0.75rem 0 1rem',
              }}
            >
              Your gold.{' '}
              <span style={{ color: 'var(--gold)' }}>Your decision.</span>
              <br />
              We are here to help.
            </h2>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-base)',
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.65,
                margin: '0 0 2rem',
              }}
            >
              Speak to someone at your nearest branch.
              No forms. No pressure. Just a quiet conversation.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <MkButton variant="gold" size="lg" href="/contact">
                Book a Confidential Appointment
              </MkButton>
              <MkButton variant="outline-light" size="lg" href="tel:+918000000001">
                Call a Branch
              </MkButton>
            </div>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-xs)',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              16 branches across Bangalore, Mysore, Mangalore &amp; Davangere
              &nbsp;&middot;&nbsp; Open Mon–Sat, 9:30 AM – 7:00 PM
            </p>

          </div>
        </div>
      </section>

      <MkFooter />
    </>
  );
}
