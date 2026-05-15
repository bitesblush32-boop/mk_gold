import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BRANCHES, getBranchBySlug, getBranchesByCity } from '@/lib/branch-router';
import type { Branch } from '@/lib/branch-router';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkButton } from '@/components/ui/MkButton';
import { MkBadge } from '@/components/ui/MkBadge';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkBranchFaq } from '@/components/sections/MkBranchFaq';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { localBusinessSchema } from '@/lib/schema/local-business';
import { faqPageSchema } from '@/lib/schema/faq-page';
import type { FaqItem } from '@/lib/schema/faq-page';

/* ─── Static params + metadata (preserved from scaffold) ─────── */

interface Props {
  params: Promise<{ area: string }>;
}

export async function generateStaticParams() {
  return BRANCHES.map((b) => ({ area: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params;
  const branch = getBranchBySlug(area);
  if (!branch) return {};

  return {
    title: `Sell Gold in ${branch.area} | Best Rate Today | MK Gold ${branch.city}`,
    description: `MK Gold ${branch.area}, ${branch.city} — ${branch.landmarksNear}. Live MCX rates, XRF purity test, payment in 30 minutes. Est. 2014.`,
    openGraph: {
      title: `Sell Gold in ${branch.area} | MK Gold ${branch.city}`,
      description: `${branch.landmarksNear}. Live MCX rates, XRF purity test, payment in 30 minutes at MK Gold ${branch.area}.`,
      url: `https://mkgold.in/${area}`,
      siteName: 'MK Gold',
      locale: 'en_IN',
      type: 'website',
    },
    alternates: { canonical: `https://mkgold.in/${area}` },
    robots: { index: true, follow: true },
  };
}

/* ─── Local data ──────────────────────────────────────────────── */

type Testimonial = { initials: string; area: string; goldType: string; value: string; quote: string };

const CITY_TESTIMONIALS: Record<Branch['city'], Testimonial[]> = {
  Bangalore: [
    { initials: 'SK', area: 'Rajajinagar',  goldType: 'Gold jewellery', value: '₹84,000',   quote: 'The XRF test was done in front of me. I knew exactly what I was being paid and why.' },
    { initials: 'AR', area: 'Koramangala',  goldType: 'Old bangles',    value: '₹43,200',   quote: 'Fast process and the staff were respectful throughout. No pressure at any point.' },
    { initials: 'RK', area: 'Jayanagar',    goldType: 'Mixed lot',      value: '₹1,08,000', quote: 'The MCX rate was shown right next to what they paid. Completely transparent.' },
  ],
  Mysore: [
    { initials: 'KN', area: 'Gokulam',       goldType: 'Gold coins',     value: '₹1,12,000', quote: 'The team explained every step. I felt comfortable the whole time.' },
    { initials: 'PM', area: 'Mysore City',   goldType: 'Gold jewellery', value: '₹56,500',   quote: 'Same-day UPI payment. I did not expect it to be this straightforward.' },
    { initials: 'SV', area: 'Vijayanagar',   goldType: '22K necklace',   value: '₹78,200',   quote: 'The weight was checked openly and I could verify it myself. Fair price.' },
  ],
  Mangalore: [
    { initials: 'MR', area: 'Mangalore',     goldType: '22K jewellery',  value: '₹67,500',   quote: 'Transparent process and immediate payment. Will come back without hesitation.' },
    { initials: 'VS', area: 'Kadri',          goldType: 'Broken gold',    value: '₹28,900',   quote: 'Even broken pieces were valued fairly. No deduction for condition.' },
    { initials: 'AD', area: 'Mangalore',     goldType: 'Gold bars',      value: '₹1,85,000', quote: 'Professional staff and the payment matched exactly what was quoted.' },
  ],
  Davangere: [
    { initials: 'PS', area: 'Davangere',     goldType: 'Gold bars',      value: '₹2,45,000', quote: 'Walked in without an appointment and was done in under 40 minutes.' },
    { initials: 'LM', area: 'Davangere',     goldType: 'Pledged gold',   value: '₹91,500',   quote: 'MK Gold handled the pledged gold release smoothly. Highly recommended.' },
    { initials: 'RS', area: 'Davangere',     goldType: 'Old jewellery',  value: '₹62,000',   quote: 'Honest and professional. The MCX rate was visible throughout the transaction.' },
  ],
};

const AREA_DESCRIPTIONS: Record<string, { description: string; directions: string }> = {
  'sell-gold-rajajinagar':      { description: 'One of Bangalore\'s most established residential areas.',      directions: 'Near Rajajinagar Main Road, easy reach from Majestic, Yeshwanthpur, and Malleswaram.' },
  'sell-gold-malleshwaram':     { description: 'The cultural heart of North Bangalore.',                       directions: 'Walking distance from 18th Cross commercial area and Sampige Road.' },
  'sell-gold-vijayanagar':      { description: 'A central area serving Mahalakshmipuram and Nagarbhavi.',      directions: 'Off Chord Road, accessible from Rajajinagar and Basaveshwaranagar.' },
  'sell-gold-basaveshwaranagar':{ description: 'Well-connected residential hub in West Bangalore.',             directions: 'Near BEL Road junction, accessible from Vijayanagar and Chord Road.' },
  'sell-gold-yeshwanthpur':     { description: 'A busy commercial hub close to the railway station.',          directions: 'Near Yeshwanthpur railway station, serving North and West Bangalore.' },
  'sell-gold-jayanagar':        { description: 'South Bangalore\'s most popular residential neighbourhood.',   directions: 'On Jayanagar 4th Block, accessible from JP Nagar, Banashankari, and BTM.' },
  'sell-gold-indiranagar':      { description: 'Central East Bangalore\'s most connected suburb.',             directions: 'On 100 Feet Road, Indiranagar — near Domlur flyover and HAL Airport Road.' },
  'sell-gold-koramangala':      { description: 'The hub of Central Bangalore, close to HSR and BTM.',         directions: 'Near Koramangala 1st Block, accessible from Ejipura and Sony World signal.' },
  'sell-gold-whitefield':       { description: 'East Bangalore\'s growing tech and residential corridor.',     directions: 'Near ITPL Main Road, accessible from Marathahalli and Varthur.' },
  'sell-gold-jp-nagar':         { description: 'Southern Bangalore close to Bannerghatta Road.',               directions: 'Near JP Nagar 7th Phase, accessible from Girinagar and Sarakki.' },
  'sell-gold-mysore-city':      { description: 'At the heart of Mysore, near Devaraja Market.',                directions: 'Close to Mysore Palace Road and the main commercial street.' },
  'sell-gold-gokulam':          { description: 'A residential area in North-West Mysore.',                    directions: 'Near Gokulam 3rd Stage, accessible from Kuvempunagar and Srirampura.' },
  'sell-gold-vijayanagar-mysore':{ description: 'A growing residential hub in North Mysore.',                  directions: 'Near Vijayanagar 4th Stage, accessible from Jayalakshmipuram and Nazarbad.' },
  'sell-gold-mangalore-city':   { description: 'The commercial centre of Mangalore near Hampankatta.',         directions: 'Near Hampankatta circle, accessible from Urwa, Bejai, and Balmatta.' },
  'sell-gold-kadri':            { description: 'Close to the Kadri Hills temple area in Mangalore.',           directions: 'Near Kadri Park, accessible from Kankanady and Mangalore City centre.' },
  'sell-gold-davangere':        { description: 'The commercial heart of Davangere City.',                      directions: 'Near Davangere main market, accessible from all parts of the city.' },
};

/* ─── Helper functions ────────────────────────────────────────── */

function buildFaqs(branch: Branch): FaqItem[] {
  const areaInfo = AREA_DESCRIPTIONS[branch.slug];
  return [
    {
      question: `Where is MK Gold ${branch.area} located?`,
      answer: `MK Gold ${branch.area} is located at ${branch.address}. You can call us at ${branch.phone} or use the map on this page for directions.`,
    },
    {
      question: `What are the opening hours of MK Gold ${branch.area}?`,
      answer: `The ${branch.area} branch is open ${branch.openHours.days}, ${branch.openHours.time}. Walk-ins are welcome — no appointment needed.`,
    },
    {
      question: `How do I reach the MK Gold branch in ${branch.area}?`,
      answer: areaInfo
        ? `${areaInfo.directions} Call ${branch.phone} for exact turn-by-turn directions.`
        : `MK Gold ${branch.area} is in ${branch.city}, Karnataka. Call ${branch.phone} for directions.`,
    },
    {
      question: `What is the gold rate in ${branch.area} today?`,
      answer: `The gold buying rate at MK Gold ${branch.area} is based on live MCX prices, updated every 5 minutes. We pay 97.5% of the MCX rate — our 2.5% margin is shown openly next to the MCX rate so you can verify it at any time. Check the live rate on this page.`,
    },
    {
      question: `What gold can I sell at the ${branch.area} branch?`,
      answer: `We buy gold jewellery (22K and 24K), gold coins, gold bars, and broken or damaged gold pieces. No original purchase receipts or hallmark certificates required. Bring one valid government photo ID — Aadhaar, PAN, Passport, Voter ID, or Driving Licence.`,
    },
  ];
}

function buildBreadcrumb(branch: Branch) {
  const citySlug = `sell-gold-${branch.city.toLowerCase()}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                        item: 'https://mkgold.in' },
      { '@type': 'ListItem', position: 2, name: `Sell Gold ${branch.city}`,    item: `https://mkgold.in/${citySlug}` },
      { '@type': 'ListItem', position: 3, name: `Sell Gold in ${branch.area}`, item: `https://mkgold.in/${branch.slug}` },
    ],
  };
}

/* ─── Page ────────────────────────────────────────────────────── */

export default async function BranchPage({ params }: Props) {
  const { area } = await params;
  const branch = getBranchBySlug(area);
  if (!branch) notFound();

  const cityBranches = getBranchesByCity(branch.city).filter((b) => b.slug !== area);
  const testimonials = CITY_TESTIMONIALS[branch.city];
  const faqs         = buildFaqs(branch);
  const areaInfo     = AREA_DESCRIPTIONS[branch.slug];

  const telHref      = `tel:${branch.phone.replace(/\s/g, '')}`;
  const mapsUrl      = branch.googleMapsUrl;
  const mapsEmbedUrl = branch.mapEmbed;
  const citySlug     = `sell-gold-${branch.city.toLowerCase()}`;

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema(branch)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema(faqs)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumb(branch)) }} />

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
              flexWrap: 'wrap',
            }}
          >
            <a href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
            <a href={`/${citySlug}`} style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
              Sell Gold {branch.city}
            </a>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ color: 'var(--gold)' }}>{branch.area}</span>
          </nav>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left: headline + CTAs */}
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <MkBadge variant="gold">ISO 9001:2015</MkBadge>
                <MkBadge variant="gold">XRF Certified</MkBadge>
                <MkBadge variant="gold">Payment in 30 min</MkBadge>
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
                Sell{' '}
                <span style={{ color: 'var(--gold)' }}>Gold</span>
                {' '}in {branch.area},{' '}
                <span style={{ color: 'rgba(255,255,255,0.65)' }}>{branch.city}</span>
              </h1>

              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-base)',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.65,
                  margin: '0 0 2rem',
                }}
              >
                Live MCX rates. XRF purity test. Payment in 30 minutes.
                Walk in today — no appointment needed.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <MkButton variant="gold" size="lg" href={telHref}>
                  Call This Branch
                </MkButton>
                <MkButton variant="outline-light" size="lg" href={mapsUrl} external>
                  Get Directions
                </MkButton>
              </div>
            </div>

            {/* Right: branch info card */}
            <div
              style={{
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 'var(--r-xl)',
                border: '1px solid rgba(223,193,96,0.15)',
                padding: '1.75rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'Tanker, serif',
                  fontSize: 'var(--t-h4)',
                  color: 'var(--gold)',
                  margin: '0 0 1.25rem',
                }}
              >
                {branch.name}
              </p>

              {[
                { label: 'Address',       value: branch.address },
                { label: 'Phone',         value: branch.phone,               href: telHref },
                { label: 'Hours',         value: `${branch.openHours.days}, ${branch.openHours.time}` },
                { label: 'Walk-ins',      value: 'Welcome — no appointment needed' },
              ].map(({ label, value, href }) => (
                <div
                  key={label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '5.5rem 1fr',
                    gap: '0.5rem',
                    padding: '0.625rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingTop: '0.1rem' }}>
                    {label}
                  </span>
                  {href ? (
                    <a href={href} style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>
                      {value}
                    </a>
                  ) : (
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
                      {value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. LIVE RATE ────────────────────────────────────────── */}
      <section className="mk-bg-light section" id="rate">
        <div className="mk-container">
          <MkSectionHeader
            tag="Live Rate"
            title="Today's Gold Rate"
            accentWord="Gold"
            subtitle={`Live MCX rate at MK Gold ${branch.area}. Updated every 5 minutes.`}
          />
          <div style={{ marginTop: '3rem', maxWidth: '480px', margin: '3rem auto 0' }}>
            <MkRateWidget variant="page" />
          </div>
        </div>
      </section>

      {/* ── 3. ABOUT THIS BRANCH ────────────────────────────────── */}
      <section style={{ background: 'white' }} className="section" id="about">
        <div className="mk-container">
          <MkSectionHeader
            tag="Our Branch"
            title={`MK Gold ${branch.area}`}
            accentWord={branch.area.split(' ')[0]}
            subtitle={`Serving ${branch.area} and surrounding areas since 2014.`}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '3rem',
              marginTop: '3rem',
              alignItems: 'start',
            }}
          >
            {/* Left: address + hours */}
            <div>
              <div
                style={{
                  background: 'var(--gallery)',
                  borderRadius: 'var(--r-xl)',
                  padding: '1.75rem',
                  marginBottom: '1.5rem',
                }}
              >
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>
                  Branch Details
                </p>
                {[
                  { label: 'Name',    value: branch.name },
                  { label: 'Address', value: branch.address },
                  { label: 'Phone',   value: branch.phone, href: telHref },
                ].map(({ label, value, href }) => (
                  <div
                    key={label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '4.5rem 1fr',
                      gap: '0.5rem',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--gallery-dk)',
                    }}
                  >
                    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingTop: '0.1rem' }}>
                      {label}
                    </span>
                    {href ? (
                      <a href={href} style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--plum)', fontWeight: 600, textDecoration: 'none' }}>
                        {value}
                      </a>
                    ) : (
                      <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--ink-mid)', lineHeight: 1.5 }}>
                        {value}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Opening hours table */}
              <div
                style={{
                  background: 'var(--gallery)',
                  borderRadius: 'var(--r-xl)',
                  padding: '1.75rem',
                }}
              >
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 700, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 1rem' }}>
                  Opening Hours
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--gallery-dk)' }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--ink-mid)' }}>{branch.openHours.days}</span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'var(--plum)' }}>{branch.openHours.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--ink-mid)' }}>Sunday</span>
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--mist)' }}>Closed</span>
                </div>
              </div>
            </div>

            {/* Right: description + map */}
            <div>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-base)',
                  color: 'var(--ink-mid)',
                  lineHeight: 1.7,
                  margin: '0 0 0.75rem',
                }}
              >
                {areaInfo?.description ?? `Our ${branch.area} branch is centrally located in ${branch.city}, Karnataka.`}
              </p>
              <p
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  color: 'var(--mist)',
                  lineHeight: 1.65,
                  margin: '0 0 1.5rem',
                }}
              >
                {areaInfo?.directions ?? `Easily accessible from all parts of ${branch.city}.`}
              </p>

              {/* Map embed */}
              <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', marginBottom: '1rem' }}>
                <iframe
                  src={mapsEmbedUrl}
                  width="100%"
                  height="280"
                  style={{ border: 0, display: 'block' }}
                  loading="lazy"
                  title={`Map showing MK Gold ${branch.area} location`}
                  aria-label={`Google Maps location of MK Gold ${branch.area}`}
                />
              </div>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  fontWeight: 600,
                  color: 'var(--plum)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                View on Google Maps
                <span aria-hidden="true" style={{ fontSize: '0.75rem' }}>›</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. 6-STEP PROCESS ───────────────────────────────────── */}
      <MkSteps />

      {/* ── 5. TESTIMONIALS ─────────────────────────────────────── */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <MkSectionHeader
            tag="Customer Stories"
            title={`Customers from ${branch.city}`}
            accentWord={branch.city}
            subtitle="Real transactions. Real people. Verified Google reviews."
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginTop: '3rem',
            }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="mk-card mk-card--gallery reveal"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Quote */}
                <p
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    color: 'var(--ink-mid)',
                    lineHeight: 1.7,
                    fontStyle: 'italic',
                    margin: '0 0 1.25rem',
                    flexGrow: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Gold type + value */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                    padding: '0.625rem 0',
                    borderTop: '1px solid var(--gallery-dk)',
                    borderBottom: '1px solid var(--gallery-dk)',
                  }}
                >
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'var(--mist)' }}>
                    {t.goldType}
                  </span>
                  <span style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h4)', color: 'var(--plum)' }}>
                    {t.value}
                  </span>
                </div>

                {/* Author */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--plum), var(--purple))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Tanker, serif',
                      fontSize: '0.75rem',
                      color: 'var(--gold)',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
                      {t.initials[0]}. from {t.area}
                    </p>
                    <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-2xs)', color: 'var(--mist)', margin: 0 }}>
                      Google Review
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INTERNAL LINK GRAPH — F20 ────────────────────────── */}
      <section style={{ background: 'white' }} className="section">
        <div className="mk-container">
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-xs)',
              fontWeight: 700,
              color: 'var(--mist)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '1.25rem',
              textAlign: 'center',
            }}
          >
            Nearby MK Gold Branches
          </p>

          {cityBranches.length > 0 ? (
            <>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.625rem',
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                }}
              >
                {cityBranches.map((b) => (
                  <MkButton key={b.slug} variant="outline-plum" size="sm" href={`/${b.slug}`}>
                    {b.area}
                  </MkButton>
                ))}
              </div>
              <p style={{ textAlign: 'center', margin: 0 }}>
                <a
                  href={`/${citySlug}`}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: 'var(--t-sm)',
                    fontWeight: 600,
                    color: 'var(--plum)',
                    textDecoration: 'none',
                  }}
                >
                  View all branches in {branch.city} &rsaquo;
                </a>
              </p>
            </>
          ) : (
            <p style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', color: 'var(--mist)', margin: 0 }}>
              This is our only branch in {branch.city}.{' '}
              <a href="/contact" style={{ color: 'var(--plum)', fontWeight: 600, textDecoration: 'none' }}>
                View all 16 branches across Karnataka &rsaquo;
              </a>
            </p>
          )}
        </div>
      </section>

      {/* ── 7. FAQ ──────────────────────────────────────────────── */}
      <MkBranchFaq faqs={faqs} areaName={branch.area} />

      {/* ── 8. CTA BAND ─────────────────────────────────────────── */}
      <section className="mk-bg-dark section" aria-labelledby={`branch-cta-${branch.slug}`}>
        <div className="mk-container">
          <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto' }}>

            <p className="mk-section-overline">Walk In Today</p>

            <h2
              id={`branch-cta-${branch.slug}`}
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h2)',
                color: 'var(--white)',
                lineHeight: 1.2,
                margin: '0.75rem 0 1rem',
              }}
            >
              Walk into MK Gold{' '}
              <span style={{ color: 'var(--gold)' }}>{branch.area}</span>
              {' '}today.
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
              No appointment. No forms. Bring your gold and one photo ID.
              Payment in 30 minutes.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <MkButton variant="gold" size="lg" href={telHref}>
                Call {branch.area} Branch
              </MkButton>
              <MkButton variant="outline-light" size="lg" href={mapsUrl} external>
                Get Directions
              </MkButton>
            </div>

            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: 'rgba(255,255,255,0.3)' }}>
              {branch.address}
              &nbsp;&middot;&nbsp;
              {branch.openHours.days}, {branch.openHours.time}
            </p>

          </div>
        </div>
      </section>

      <MkFooter />
    </>
  );
}
