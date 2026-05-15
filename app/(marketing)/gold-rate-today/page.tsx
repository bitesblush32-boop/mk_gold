import type { Metadata } from 'next';
import { fetchGoldRate } from '@/lib/gold-rate';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkCalculator } from '@/components/features/MkCalculator';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { GoldRateChart } from './GoldRateChart';
import { GoldRateFaq } from './GoldRateFaq';
import { getFaqsByPage } from '@/lib/db/faqs';

/* ─── ISR — revalidate every 5 minutes ──────────────────────────── */
export const revalidate = 300;

/* ─── Comparison table rows ─────────────────────────────────────── */
const COMPARE_ROWS = [
  {
    feature: 'Rate offered',
    mk: '97.5% of MCX spot — shown openly beside MCX rate',
    bank: 'MCX minus 10–25% (gold loan, not a purchase)',
    jeweller: 'MCX minus 15% or lower',
  },
  {
    feature: 'Purity test method',
    mk: 'XRF spectrometer (Bruker S1 Titan) — certified, non-destructive',
    bank: 'Hallmark or acid test — less accurate',
    jeweller: 'Acid test or visual estimate',
  },
  {
    feature: 'Payment time',
    mk: '45 minutes from walk-in',
    bank: '3–7 working days after loan foreclosure',
    jeweller: 'Immediate (lower rate)',
  },
  {
    feature: 'Documentation needed',
    mk: 'One photo ID only',
    bank: 'Loan docs, foreclosure forms, NOC',
    jeweller: 'None (no receipt given to you)',
  },
  {
    feature: 'Transparency',
    mk: 'MCX rate shown beside our buying rate — always',
    bank: 'Rate not disclosed upfront',
    jeweller: 'Rate not disclosed',
  },
] as const;

/* ─── Metadata ─────────────────────────────────────────────────── */
export async function generateMetadata(): Promise<Metadata> {
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const title       = `Gold Rate Today in Karnataka | Live MCX Price | MK Gold — ${date}`;
  const description =
    'Live gold rate today in Bangalore, Mysore, Mangalore and Davangere. 22K, 24K, 20K, 18K gold price per gram — updated every 5 minutes from MCX. Free XRF purity test at all 16 MK Gold branches.';

  return {
    title,
    description,
    keywords: [
      'gold rate today bangalore',
      'gold rate 22k today',
      '22 karat gold price today',
      'gold price today india',
      'mcx gold rate today',
      'gold rate per gram today',
    ],
    openGraph: {
      title,
      description,
      url: 'https://mkgold.in/gold-rate-today',
      siteName: 'MK Gold',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: { canonical: 'https://mkgold.in/gold-rate-today' },
    robots: { index: true, follow: true },
    other: { 'article:modified_time': new Date().toISOString() },
  };
}

/* ─── Page ─────────────────────────────────────────────────────── */
export default async function GoldRateTodayPage() {
  const faqItems = await getFaqsByPage('gold-rate');
  const rate = await fetchGoldRate();

  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  /* Derived values for display */
  const mkBuyRate24k = Math.round(rate.mcxRate * 0.975);

  /* JSON-LD: BreadcrumbList */
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',            item: 'https://mkgold.in' },
      { '@type': 'ListItem', position: 2, name: 'Gold Rate Today', item: 'https://mkgold.in/gold-rate-today' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <MkNavbar />

      {/* ══ 1. HERO ════════════════════════════════════════════════════ */}
      <section className="mk-bg-dark section">
        <div className="mk-container">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-xs)',
              color: 'rgba(255,255,255,0.40)',
              marginBottom: '2.5rem',
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'center',
            }}
          >
            <a href="/" style={{ color: 'rgba(255,255,255,0.40)', textDecoration: 'none' }}>
              Home
            </a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.20)' }}>›</span>
            <span style={{ color: 'var(--gold)' }}>Gold Rate Today</span>
          </nav>

          {/* Page heading */}
          <div style={{ marginBottom: '2.5rem' }}>
            <p className="mk-section-overline" style={{ marginBottom: '0.75rem' }}>
              {formattedDate}
            </p>
            <h1
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                lineHeight: 1.1,
                margin: '0 0 0.875rem',
                letterSpacing: 'var(--ls-tight)',
              }}
            >
              Gold Rate Today in{' '}
              <span style={{ color: 'var(--gold)' }}>Bangalore</span>
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-sm)',
                color: 'rgba(255,255,255,0.45)',
                margin: 0,
                letterSpacing: '0.02em',
              }}
            >
              MCX-linked rates · Verified XRF purity · 16 branches across Karnataka
            </p>
          </div>

          {/* ── Rate grid — 2×2 ─────────────────────────────────────── */}
          <div className="mk-rate-grid">
            {[
              { label: '24K Gold', purity: '999 Fine',     r: rate.rate24k },
              { label: '22K Gold', purity: '916 Hallmark', r: rate.rate22k },
              { label: '20K Gold', purity: '833 Purity',   r: rate.rate20k },
              { label: '18K Gold', purity: '750 Purity',   r: rate.rate18k },
            ].map(({ label, purity, r }) => (
              <div key={label} className="mk-rate-cell">
                <p className="mk-rate-cell__label">{label}</p>
                <p className="mk-rate-cell__purity">{purity}</p>
                <p className="mk-rate-cell__value">₹{r.toLocaleString('en-IN')}</p>
                <p className="mk-rate-cell__unit">per gram</p>
              </div>
            ))}
          </div>

          {/* Updated note */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-2xs)',
              color: 'rgba(255,255,255,0.28)',
              margin: '0.875rem 0 1.75rem',
              letterSpacing: '0.03em',
            }}
          >
            Updated every 5 minutes from MCX
            {rate.source === 'fallback' &&
              ' · Indicative rates — live feed updating shortly'}
          </p>

          {/* ── N04 — MCX vs MK margin row ──────────────────────────── */}
          <div className="mk-rate-margin">
            <div className="mk-rate-margin__col">
              <p className="mk-rate-margin__label">MCX Spot (24K / 10g)</p>
              <p className="mk-rate-margin__value">
                ₹{rate.mcxRate.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="mk-rate-margin__arrow" aria-hidden="true" />

            <div className="mk-rate-margin__col">
              <p className="mk-rate-margin__label">MK Gold Buying Rate</p>
              <p className="mk-rate-margin__value mk-rate-margin__value--gold">
                ₹{mkBuyRate24k.toLocaleString('en-IN')}
              </p>
            </div>

            <span className="mk-rate-margin__pill">97.5% of MCX</span>
          </div>

        </div>
      </section>

      {/* ══ 2. HISTORICAL CHART ════════════════════════════════════════ */}
      <GoldRateChart />

      {/* ══ 3. CALCULATOR ═════════════════════════════════════════════ */}
      <section className="mk-bg-light section" id="calculator">
        <div className="mk-container">
          <MkSectionHeader
            tag="Gold Calculator"
            title="How Much Is Your Gold Worth?"
            accentWord="Much"
            subtitle="Enter weight and purity to see your estimated payout at today's live MCX rate."
          />
          <div
            style={{
              marginTop: '3rem',
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <MkCalculator variant="light" showBookingCTA />
          </div>
        </div>
      </section>

      {/* ══ 4. HOW IS THE RATE CALCULATED ═════════════════════════════ */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '840px', margin: '0 auto' }}>

            <p className="mk-section-overline">Transparency</p>
            <h2
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--ink)',
                margin: '0.5rem 0 1.25rem',
                lineHeight: 1.15,
              }}
            >
              How is the gold rate calculated?
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-base)',
                color: 'var(--ink-mid)',
                lineHeight: 1.75,
                margin: '0 0 2rem',
                maxWidth: '66ch',
              }}
            >
              MK Gold&apos;s buying rate is linked directly to the live MCX spot price — the
              same rate displayed on commodity exchanges across India. We do not use a
              proprietary or arbitrary &ldquo;market rate&rdquo;. Every calculation is
              transparent and verifiable.
            </p>

            {/* Formula block */}
            <div
              style={{
                borderLeft: '3px solid var(--plum)',
                background: 'var(--white)',
                borderRadius: '0 var(--r-xl) var(--r-xl) 0',
                padding: '1.75rem 2rem',
                marginBottom: '1.75rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 'var(--t-xs)',
                  color: 'var(--plum)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 0.875rem',
                }}
              >
                The formula
              </p>
              <p
                style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: 'var(--t-h3)',
                  color: 'var(--ink)',
                  lineHeight: 1.4,
                  margin: '0 0 0.5rem',
                }}
              >
                Weight (g) &times; Purity% &times; MCX Rate &divide; 10 &times; 97.5%
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  color: 'var(--mist)',
                  margin: 0,
                }}
              >
                = Your Payment in INR
              </p>
            </div>

            {/* Live calculation example */}
            <div
              style={{
                background: 'var(--white)',
                borderRadius: 'var(--r-xl)',
                padding: '1.5rem 2rem',
                border: '1px solid var(--gallery-dk)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 700,
                  fontSize: 'var(--t-xs)',
                  color: 'var(--mist)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  margin: '0 0 1rem',
                }}
              >
                Live example — 10g of 22K gold at today&apos;s rate
              </p>
              {[
                ['MCX 24K spot (per 10g)',          `₹${rate.mcxRate.toLocaleString('en-IN')}`],
                ['22K purity factor (91.67%)',        `₹${rate.rate22k.toLocaleString('en-IN')} per gram`],
                ['For 10g at 22K rate',               `₹${(rate.rate22k * 10).toLocaleString('en-IN')}`],
                ['MK Gold pays 97.5%',                `₹${Math.round(rate.rate22k * 10 * 0.975).toLocaleString('en-IN')}`],
              ].map(([label, value], idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: idx < 3 ? '1px solid var(--gallery-dk)' : 'none',
                    padding: '0.625rem 0',
                    gap: '1rem',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontSize: 'var(--t-sm)',
                      color: idx === 3 ? 'var(--ink)' : 'var(--ink-mid)',
                      fontWeight: idx === 3 ? 600 : 400,
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: idx === 3 ? 'Tanker, serif' : 'Poppins, sans-serif',
                      fontSize: idx === 3 ? 'var(--t-h4)' : 'var(--t-sm)',
                      fontWeight: idx < 3 ? 600 : undefined,
                      color: idx === 3 ? 'var(--plum)' : 'var(--ink)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ 5. COMPARISON TABLE ═══════════════════════════════════════ */}
      <section style={{ background: 'var(--white)' }} className="section">
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '960px', margin: '0 auto' }}>

            <p className="mk-section-overline">Comparison</p>
            <h2
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--ink)',
                margin: '0.5rem 0 1.75rem',
                lineHeight: 1.15,
              }}
            >
              How MK Gold compares
            </h2>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table className="mk-compare-table">
                <thead>
                  <tr>
                    <th className="mk-compare-table__th mk-compare-table__th--feature">
                      Feature
                    </th>
                    <th className="mk-compare-table__th mk-compare-table__th--mk">
                      MK Gold
                    </th>
                    <th className="mk-compare-table__th">Bank Gold Loan</th>
                    <th className="mk-compare-table__th">Local Jeweller</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 !== 0 ? 'mk-compare-table__row--stripe' : ''}
                    >
                      <td className="mk-compare-table__td mk-compare-table__td--feature">
                        {row.feature}
                      </td>
                      <td className="mk-compare-table__td mk-compare-table__td--mk">
                        {row.mk}
                      </td>
                      <td className="mk-compare-table__td">{row.bank}</td>
                      <td className="mk-compare-table__td">{row.jeweller}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 6. FAQ ════════════════════════════════════════════════════ */}
      <GoldRateFaq faqs={faqItems} />

      {/* ══ 7. CTA BAND ══════════════════════════════════════════════ */}
      <MkCtaBand />

      <MkFooter />
    </>
  );
}
