import type { Metadata } from 'next';

export const revalidate = false; // Static at build — content from local data only

import { MkNavbar }        from '@/components/layout/MkNavbar';
import { MkFooter }        from '@/components/layout/MkFooter';
import { MkCard }          from '@/components/ui/MkCard';
import { AboutHeroLogo }   from '@/components/features/AboutHeroLogo';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { MkTrustBlock }    from '@/components/ui/MkTrustBlock';
import { MkButton }        from '@/components/ui/MkButton';
import { MkStatBand }      from '@/components/sections/MkStatBand';
import { MkCtaBand }       from '@/components/sections/MkCtaBand';
import { FlippableSeal }   from '@/components/features/FlippableSeal';
import { VALUES, CITIES }  from '@/lib/data/about';

/* ─── Metadata ─────────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'About MK Gold | 15 Years Trusted | Karnataka Since 2014',
  description:
    "MK Gold — established 2014. Karnataka's trusted gold buyer. 16 branches, ISO 9001:2015 certified, German XRF spectrometer, 10,000+ customers served.",
  openGraph: {
    title: "About MK Gold | Karnataka's Most Trusted Gold Buyer Since 2014",
    description:
      'Learn about MK Gold — 15+ years of transparent gold buying across Karnataka. 16 branches, ISO certified, XRF tested.',
    url: 'https://mkgold.in/about',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  alternates: { canonical: 'https://mkgold.in/about' },
  robots: { index: true, follow: true },
};

/* ─── Schemas ───────────────────────────────────────────────────── */

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'MK Gold',
  url: 'https://mkgold.in',
  logo: 'https://mkgold.in/brand/logo_light_eng.png',
  foundingDate: '2014',
  description:
    "MK Gold is Karnataka's most trusted gold buyer. Established in Bangalore in 2014. 16 branches across Bangalore, Mysore, Mangalore and Davangere.",
  address: { '@type': 'PostalAddress', addressRegion: 'Karnataka', addressCountry: 'IN' },
  areaServed: { '@type': 'State', name: 'Karnataka' },
  sameAs: ['https://www.instagram.com/mkgold.in', 'https://www.facebook.com/mkgold.in'],
};

const ABOUT_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About MK Gold',
  url: 'https://mkgold.in/about',
  description:
    "Learn about MK Gold — Karnataka's trusted gold buyer since 2014. 15+ years of transparent gold buying across 16 branches.",
  publisher: { '@type': 'Organization', name: 'MK Gold', url: 'https://mkgold.in' },
};

/* ─── Page ──────────────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ABOUT_SCHEMA) }}
      />

      <MkNavbar />

      {/* ══ 1. HERO ════════════════════════════════════════════════ */}
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
            <a href="/" style={{ color: 'rgba(255,255,255,0.40)', textDecoration: 'none' }}>Home</a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.20)' }}>›</span>
            <span style={{ color: 'var(--gold)' }}>About Us</span>
          </nav>

          {/* Two-column layout: copy left, animated logo right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '3fr 2fr',
            gap: 'var(--s-16)',
            alignItems: 'center',
          }}>

            {/* Left — copy */}
            <div>
              {/* Eyebrow */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.75rem' }}>
                <div aria-hidden="true" style={{ width: '2.5rem', height: '1px', background: 'var(--gold)', opacity: 0.55 }} />
                <p className="mk-section-overline" style={{ margin: 0 }}>Established 2014 · Karnataka</p>
                <div aria-hidden="true" style={{ width: '2.5rem', height: '1px', background: 'var(--gold)', opacity: 0.55 }} />
              </div>

              {/* H1 */}
              <h1 style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                lineHeight: 1.05,
                margin: '0 0 1.25rem',
                letterSpacing: 'var(--ls-tight)',
              }}>
                About MK Gold
              </h1>

              {/* Subtitle */}
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.65)',
                margin: '0 0 1.75rem',
                lineHeight: 1.6,
                maxWidth: '520px',
              }}>
                A name customers turn to during some of life&apos;s most important financial moments.
              </p>

              {/* Kannada tagline */}
              <p lang="kn" style={{
                fontFamily: 'Anek Kannada, sans-serif',
                fontSize: 'var(--t-h4)',
                fontWeight: 600,
                color: 'var(--gold)',
                margin: 0,
                letterSpacing: '0.02em',
              }}>
                ತಕ್ಷಣ ಹಣ, ಶಾಶ್ವತ ವಿಶ್ವಾಸ
              </p>
            </div>

            {/* Right — animated logo + coin (hidden on mobile) */}
            <div className="mk-about-hero-visual" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--s-6)',
              position: 'relative',
            }}>
              {/* Radial gold glow behind logo */}
              <div aria-hidden="true" style={{
                position: 'absolute',
                inset: '-20%',
                background: 'radial-gradient(ellipse at center, rgba(223,193,96,0.10) 0%, transparent 68%)',
                pointerEvents: 'none',
              }} />

              {/* Bilingual animated logo */}
              <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <AboutHeroLogo />
              </div>

              {/* Gold accent line */}
              <div aria-hidden="true" style={{ width: '3rem', height: '2px', background: 'var(--gold)', opacity: 0.40 }} />

              {/* Flipping seal coin */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <FlippableSeal size="lg" wobble />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 2. BRAND STORY ════════════════════════════════════════ */}
      <section className="mk-bg-light section">
        <div className="mk-container">

          <div className="mk-about-split reveal">

            {/* Left — editorial pull quote */}
            <div className="mk-about-split__left">
              <div
                aria-hidden="true"
                style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: '6rem',
                  color: 'var(--gold)',
                  opacity: 0.20,
                  lineHeight: 0.65,
                  marginBottom: '0.25rem',
                  userSelect: 'none',
                  letterSpacing: '-0.02em',
                }}
              >
                &ldquo;
              </div>
              <blockquote
                style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: 'var(--t-h2)',
                  color: 'var(--plum)',
                  lineHeight: 1.25,
                  margin: 0,
                  letterSpacing: 'var(--ls-tight)',
                }}
              >
                Trust is not built overnight — it is earned through years of honesty,
                transparency, and respect.
              </blockquote>
            </div>

            {/* Vertical divider */}
            <div className="mk-about-split__divider" aria-hidden="true" />

            {/* Right — brand story */}
            <div className="mk-about-split__right">
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.8, margin: '0 0 1.25rem' }}>
                At MK Gold, trust is not built overnight — it is earned through years of honesty, transparency, and respect. With a legacy of over 15 years in Bengaluru, MK Gold has become a name customers turn to during some of life&apos;s most important financial moments.
              </p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.8, margin: '0 0 1.5rem' }}>
                Selling gold is often an emotional decision. Many people walk into traditional gold-buying stores feeling anxious, uncertain, or even judged. MK Gold was built to change that experience completely.
              </p>

              {/* "We believe every customer deserves" list */}
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--plum)', margin: '0 0 0.75rem', letterSpacing: '0.01em' }}>
                We believe every customer deserves:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem' }}>
                {[
                  'Transparent gold testing done openly in front of them',
                  'A clear explanation of purity and weight',
                  'Fair valuation without hidden deductions',
                  'A professional, respectful environment that protects their dignity',
                ].map((item) => (
                  <li key={item} style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    lineHeight: 1.7,
                    padding: '0.35rem 0 0.35rem 1rem',
                    borderLeft: '2px solid var(--gold)',
                    marginBottom: '0.5rem',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>

              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.8, margin: 0 }}>
                Our purpose goes beyond buying gold. We exist to provide immediate financial support with honesty, empathy, and trust — helping customers convert their gold into instant liquidity with complete confidence.
              </p>
            </div>
          </div>

          {/* Closing ambition line */}
          <div
            className="reveal delay-2"
            style={{
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--gallery-dk)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <div
              aria-hidden="true"
              style={{ width: '3rem', height: '2px', background: 'var(--gold)', flexShrink: 0 }}
            />
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'var(--ink)',
                fontWeight: 500,
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              Today, MK Gold is evolving with a larger ambition: to become Karnataka&apos;s most trusted organised gold buying brand and the first name people think of whenever they need a fair and reliable gold-selling experience.
            </p>
          </div>

        </div>
      </section>

      {/* ══ 3. VISION & MISSION ═══════════════════════════════════ */}
      <section className="mk-bg-dark section">
        <div className="mk-container">

          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="mk-section-overline">Who We Are</p>
            <h2 style={{
              fontFamily: 'Tanker, serif',
              fontSize: 'var(--t-h2)',
              color: 'var(--white)',
              margin: '0.5rem 0 0',
              lineHeight: 1.15,
            }}>
              Vision &amp; Mission
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}>
            <MkTrustBlock title="Our Vision" className="reveal delay-1">
              To become the most trusted gold buying brand across Karnataka and South India
              by setting new standards in transparency, fairness, and customer trust.
            </MkTrustBlock>

            <MkTrustBlock title="Our Mission" className="reveal delay-2">
              To provide immediate liquidity against gold through transparent evaluation,
              fair pricing, and a respectful, non-judgmental customer experience that values
              people as much as their gold.
            </MkTrustBlock>
          </div>

        </div>
      </section>

      {/* ══ 4. SEAL SHOWCASE ══════════════════════════════════════ */}
      <section className="mk-bg-dark section">
        <div className="mk-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2.5rem',
            }}
          >

            {/* Single flipping seal coin — EN front / KN back */}
            <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
              <FlippableSeal size="lg" wobble />
            </div>

            {/* Copy below seals */}
            <div
              className="reveal delay-2"
              style={{ textAlign: 'center', maxWidth: '540px' }}
            >
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-base)',
                  fontWeight: 600,
                  color: 'var(--gold)',
                  margin: '0 0 0.5rem',
                  letterSpacing: '0.02em',
                }}
              >
                MK Andare Nambike
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                  lineHeight: 1.65,
                }}
              >
                This is not just a tagline. It is our founding promise — that the MK Gold name
                stands for trust, in English and in Kannada, in every city and every branch.
              </p>
            </div>

            {/* Google rating highlight */}
            <div
              className="reveal delay-3"
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '1.25rem',
                background: 'rgba(223,193,96,0.08)',
                border: '1px solid rgba(223,193,96,0.25)',
                borderRadius: 'var(--r-xl)',
                padding: '1.25rem 2rem',
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  animation: 'mk-rating-glow 2.5s ease-in-out infinite',
                }}>
                  <span style={{ fontFamily: 'Tanker,serif', fontSize: '2.75rem', color: 'var(--gold)', lineHeight: 1 }}>4.9</span>
                  <div style={{ display: 'flex', gap: '3px', margin: '4px 0' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} style={{
                        display: 'inline-block', width: '14px', height: '14px',
                        animation: `mk-star-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both`,
                        animationDelay: `${i * 0.08}s`,
                        background: 'var(--gold)',
                        clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-2xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                    Google Rating
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 'var(--t-base)', color: 'white', margin: 0, lineHeight: 1.3 }}>
                    4.9 out of 5 stars
                  </p>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-sm)', color: 'rgba(255,255,255,0.55)', margin: '0.25rem 0 0' }}>
                    Based on 200+ verified Google Reviews
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ 5. VALUES ═════════════════════════════════════════════ */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Our Values"
            title="What guides every transaction"
            accentWord="every"
            subtitle="What we believe every customer deserves."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            {VALUES.map((v, i) => (
              <MkCard
                key={v.heading}
                variant="gallery"
                hover={false}
                className={`reveal delay-${i + 1}`}
                style={{ padding: '2rem' }}
              >
                {/* Ghost decorative letter */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: 'Tanker, serif',
                    fontSize: '4.5rem',
                    color: 'var(--plum)',
                    opacity: 0.07,
                    lineHeight: 1,
                    marginBottom: '-0.875rem',
                    userSelect: 'none',
                  }}
                >
                  {v.heading[0]}
                </div>

                {/* Gold accent bar */}
                <div
                  aria-hidden="true"
                  style={{
                    width: '2rem',
                    height: '2px',
                    background: 'var(--gold)',
                    marginBottom: '1rem',
                  }}
                />

                <h3
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-h4)',
                    fontWeight: 600,
                    color: 'var(--plum)',
                    margin: '0 0 0.75rem',
                    lineHeight: 1.2,
                  }}
                >
                  {v.heading}
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
                  {v.body}
                </p>
              </MkCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. CERTIFICATIONS ════════════════════════════════════ */}
      <section className="mk-bg-dark section">
        <div className="mk-container">

          <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="mk-section-overline">Certifications</p>
            <h2
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--white)',
                margin: '0.5rem 0 0',
                lineHeight: 1.15,
              }}
            >
              Built on verified standards
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <MkTrustBlock title="ISO 9001:2015 Certified" className="reveal delay-1">
              Our entire process — from weighing to payout — is ISO certified. Every transaction
              is documented, every rate is traceable. Certification issued and audited annually.
            </MkTrustBlock>

            <MkTrustBlock title="German XRF Spectrometer" className="reveal delay-2">
              We use a Bruker S1 Titan XRF spectrometer — the same instrument used by refineries
              worldwide. It reads the exact gold content using X-ray fluorescence in under 2
              minutes. No acid. No scratch. No damage to your jewellery.
            </MkTrustBlock>
          </div>

        </div>
      </section>

      {/* ══ 7. CITY PRESENCE ══════════════════════════════════════ */}
      <section className="mk-bg-dark section">
        <div className="mk-container">

          <div className="reveal" style={{ marginBottom: '3rem' }}>
            <p className="mk-section-overline">Our Presence</p>
            <h2
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--white)',
                margin: '0.5rem 0 0.75rem',
                lineHeight: 1.15,
              }}
            >
              Across 4 cities. Same process. Same promise.
            </h2>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-sm)',
                color: 'rgba(255,255,255,0.40)',
                margin: 0,
              }}
            >
              16 branches, one standard of trust.
            </p>
          </div>

          {/* City cards */}
          <div className="mk-city-grid">
            {CITIES.map((city, i) => (
              <a
                key={city.name}
                href={city.href}
                className={`mk-city-card reveal delay-${i + 1}`}
              >
                <span className="mk-city-card__count">{city.branches}</span>
                <span className="mk-city-card__unit">
                  {city.branches === 1 ? 'branch' : 'branches'}
                </span>
                <span className="mk-city-card__name">{city.name}</span>
              </a>
            ))}
          </div>

          <div className="reveal delay-2" style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <MkButton variant="outline-light" href="/contact">
              View All Branches
            </MkButton>
          </div>

        </div>
      </section>

      {/* ══ 8. STAT BAND ══════════════════════════════════════════ */}
      <MkStatBand />

      {/* ══ 9. CTA + FOOTER ═══════════════════════════════════════ */}
      <MkCtaBand />
      <MkFooter />
    </>
  );
}
