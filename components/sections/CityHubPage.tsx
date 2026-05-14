// Shared server component for all four city hub pages (N14)
// Used by: sell-gold-bangalore · sell-gold-mysore · sell-gold-mangalore · sell-gold-davangere

import { BRANCHES } from '@/lib/branch-router';
import type { Branch } from '@/lib/branch-router';
import { MkNavbar }        from '@/components/layout/MkNavbar';
import { MkFooter }        from '@/components/layout/MkFooter';
import { MkRateWidget }    from '@/components/features/MkRateWidget';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { MkSteps }         from '@/components/sections/MkSteps';
import { MkCtaBand }       from '@/components/sections/MkCtaBand';
import { CityFaq }         from '@/components/sections/CityFaq';
import type { FaqItem }    from '@/components/sections/CityFaq';

type City = Branch['city'];

/* ─── Testimonials ─────────────────────────────────────────────── */

interface Testimonial {
  author: string;
  location: string;
  rating: number;
  date: string;
  quote: string;
}

const CITY_TESTIMONIALS: Record<City, Testimonial[]> = {
  Bangalore: [
    {
      author: 'Sunita Rao',
      location: 'Indiranagar, Bangalore',
      rating: 5,
      date: 'March 2025',
      quote:
        'Got ₹1.2 lakh for 14 grams of old jewellery in under 45 minutes. They showed me the XRF test live on screen — first time I fully understood what my gold was worth.',
    },
    {
      author: 'Arun Gowda',
      location: 'Koramangala, Bangalore',
      rating: 5,
      date: 'February 2025',
      quote:
        'I checked three jewellers before coming to MK Gold. Their rate was the highest and they showed the MCX benchmark openly. Walked out in 40 minutes with full payment.',
    },
    {
      author: 'Divya Nair',
      location: 'Whitefield, Bangalore',
      rating: 5,
      date: 'April 2025',
      quote:
        'The Whitefield branch team was incredibly professional. No pushy tactics, no delays. The whole process was exactly what they described online.',
    },
  ],
  Mysore: [
    {
      author: 'Mohan Kumar',
      location: 'Mysore City',
      rating: 5,
      date: 'January 2025',
      quote:
        'I was sceptical about selling gold, but the team at Mysore City branch explained every step clearly. The rate matched exactly what the website calculator showed.',
    },
    {
      author: 'Shantha Devi',
      location: 'Gokulam, Mysore',
      rating: 5,
      date: 'March 2025',
      quote:
        'The Gokulam branch staff were patient and respectful. They tested my jewellery right in front of me — no disappearing behind a curtain. Very reassuring.',
    },
    {
      author: 'Venkatesh Rao',
      location: 'Vijayanagar, Mysore',
      rating: 5,
      date: 'February 2025',
      quote:
        '11 years in business really shows. Professional, honest, and fast. Got my money in 40 minutes. Would recommend to anyone in Mysore.',
    },
  ],
  Mangalore: [
    {
      author: 'Praveen Shetty',
      location: 'Mangalore City',
      rating: 5,
      date: 'February 2025',
      quote:
        'Fast, transparent, and fair. The XRF test took 2 minutes and the offer was excellent — close to what the online calculator showed. Very good service.',
    },
    {
      author: 'Lalitha Nayak',
      location: 'Kadri, Mangalore',
      rating: 5,
      date: 'March 2025',
      quote:
        'The Kadri branch team was very welcoming. First time selling gold and they made it completely stress-free. Payment was in my account within the hour.',
    },
    {
      author: 'Suresh Bhat',
      location: 'Mangalore',
      rating: 5,
      date: 'January 2025',
      quote:
        'MK Gold gave me a better rate than both the jewellers I visited. The live MCX rate display made everything transparent. Very professional.',
    },
  ],
  Davangere: [
    {
      author: 'Krishnamurthy S.',
      location: 'Davangere',
      rating: 5,
      date: 'March 2025',
      quote:
        "I didn't expect such a professional experience in Davangere. The XRF purity test was done right in front of me and the rate was fair. Will recommend to others.",
    },
    {
      author: 'Savitha M.',
      location: 'Davangere',
      rating: 5,
      date: 'February 2025',
      quote:
        'Needed emergency cash quickly. The Davangere branch handled everything in 35 minutes — from walk-in to payment. No complications, no delays.',
    },
    {
      author: 'Ramesh D.',
      location: 'Davangere',
      rating: 5,
      date: 'April 2025',
      quote:
        'The staff explained the MCX rate and the margin clearly before making an offer. That kind of transparency is rare. Excellent experience.',
    },
  ],
};

/* ─── FAQs ─────────────────────────────────────────────────────── */

const CITY_FAQS: Record<City, FaqItem[]> = {
  Bangalore: [
    {
      q: 'Where can I sell gold in Bangalore?',
      a: 'MK Gold has 10 branches across Bangalore: Rajajinagar, Malleshwaram, Vijayanagar, Basaveshwaranagar, Yeshwanthpur, Jayanagar, Indiranagar, Koramangala, Whitefield, and JP Nagar. All branches are open Monday to Saturday, 9:30 AM to 7:00 PM. Walk-ins are always welcome — no appointment needed.',
    },
    {
      q: 'What is the best gold rate in Bangalore today?',
      a: 'MK Gold pays 97.5% of the live MCX rate, updated every 5 minutes. The rate displayed on this page is what you will receive when you walk into any Bangalore branch — no bait and switch. The MCX benchmark and our buying rate are shown side by side openly.',
    },
    {
      q: 'How many MK Gold branches are in Bangalore?',
      a: 'There are 10 MK Gold branches in Bangalore, spread across major localities: Rajajinagar, Malleshwaram, Vijayanagar, Basaveshwaranagar, Yeshwanthpur, Jayanagar, Indiranagar, Koramangala, Whitefield, and JP Nagar.',
    },
    {
      q: 'Is MK Gold a safe and certified gold buyer in Bangalore?',
      a: 'Yes. MK Gold is ISO 9001:2015 certified and has operated in Bangalore since 2014. We use a Bruker XRF spectrometer for purity testing — no acid test, no scratches. Over 10,000 customers have sold gold with us. All payments are immediate: cash, NEFT, or UPI.',
    },
  ],
  Mysore: [
    {
      q: 'Where can I sell gold in Mysore?',
      a: 'MK Gold has 3 branches in Mysore: Mysore City, Gokulam, and Vijayanagar. All branches are open Monday to Saturday, 9:30 AM to 7:00 PM. Walk-ins are always welcome.',
    },
    {
      q: 'What is the gold rate in Mysore today?',
      a: 'MK Gold pays 97.5% of the live MCX gold rate, refreshed every 5 minutes. The rate shown on this page is the same rate our Mysore branches use — updated in real time from the MCX feed.',
    },
    {
      q: 'How many MK Gold branches are in Mysore?',
      a: 'There are 3 MK Gold branches in Mysore: Mysore City, Gokulam, and Vijayanagar. Each branch follows the same process and transparent pricing.',
    },
    {
      q: 'Is MK Gold safe and certified in Mysore?',
      a: 'Yes. MK Gold is ISO 9001:2015 certified and has been buying gold since 2014. Our Mysore branches use the same XRF purity testing and transparent MCX pricing as every other branch across Karnataka.',
    },
  ],
  Mangalore: [
    {
      q: 'Where can I sell gold in Mangalore?',
      a: 'MK Gold has 2 branches in Mangalore: Mangalore City and Kadri. Both are open Monday to Saturday, 9:30 AM to 7:00 PM. Walk-ins are always welcome.',
    },
    {
      q: 'What is the gold rate in Mangalore today?',
      a: 'MK Gold pays 97.5% of the live MCX rate, refreshed every 5 minutes. The rate shown on this page reflects what our Mangalore branches offer when you walk in.',
    },
    {
      q: 'How many MK Gold branches are in Mangalore?',
      a: 'There are 2 MK Gold branches in Mangalore: Mangalore City and Kadri.',
    },
    {
      q: 'Is MK Gold safe and certified in Mangalore?',
      a: 'Yes. MK Gold is ISO 9001:2015 certified with over 11 years in operation. Our Mangalore branches use the same Bruker XRF spectrometer and live MCX rates that customers across Karnataka trust.',
    },
  ],
  Davangere: [
    {
      q: 'Where can I sell gold in Davangere?',
      a: 'MK Gold has a branch in Davangere, open Monday to Saturday from 9:30 AM to 7:00 PM. Walk-ins are always welcome — no prior appointment required.',
    },
    {
      q: 'What is the gold rate in Davangere today?',
      a: 'MK Gold pays 97.5% of the live MCX gold rate, updated every 5 minutes. The rate you see on this page is what the Davangere branch applies when you walk in.',
    },
    {
      q: 'Is there an MK Gold branch in Davangere?',
      a: 'Yes. MK Gold has one branch in Davangere, serving the city and surrounding areas. It follows the same process and pricing as all 16 branches across Karnataka.',
    },
    {
      q: 'Is MK Gold a safe buyer in Davangere?',
      a: 'Yes. MK Gold is ISO 9001:2015 certified and has 11 years of experience buying gold. The Davangere branch uses the same German XRF spectrometer and live MCX pricing as every other branch.',
    },
  ],
};

/* ─── Stars helper ─────────────────────────────────────────────── */

function Stars({ rating }: { rating: number }) {
  return (
    <div className="mk-review-card__stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`mk-review-card__star${i < rating ? ' mk-review-card__star--filled' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

/* ─── Google Maps URL ──────────────────────────────────────────── */

function mapsUrl(branch: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    branch.name + ' ' + branch.address
  )}`;
}

/* ─── Component ────────────────────────────────────────────────── */

interface CityHubPageProps { city: City; }

export function CityHubPage({ city }: CityHubPageProps) {
  const branches     = BRANCHES.filter(b => b.city === city);
  const testimonials = CITY_TESTIMONIALS[city];
  const faqs         = CITY_FAQS[city];
  const n            = branches.length;

  // LocalBusiness JSON-LD (city level)
  const firstBranch = branches[0];
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `MK Gold ${city}`,
    description: `MK Gold has ${n} ${n === 1 ? 'branch' : 'branches'} in ${city}. Sell gold at live MCX rates with XRF purity testing. Payment in 45 minutes.`,
    url: `https://mkgold.in/sell-gold-${city.toLowerCase()}`,
    telephone: firstBranch?.phone,
    areaServed: city,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: 'Karnataka',
      addressCountry: 'IN',
    },
    geo: firstBranch
      ? { '@type': 'GeoCoordinates', latitude: firstBranch.coordinates.lat, longitude: firstBranch.coordinates.lng }
      : undefined,
    openingHours: 'Mo-Sa 09:30-19:00',
    priceRange: '₹₹',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '200',
    },
  };

  // BreadcrumbList JSON-LD
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mkgold.in' },
      { '@type': 'ListItem', position: 2, name: `Sell Gold in ${city}`, item: `https://mkgold.in/sell-gold-${city.toLowerCase()}` },
    ],
  };

  return (
    <main>
      <MkNavbar />

      {/* ── JSON-LD ─────────────────────────────────────── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── Hero ────────────────────────────────────────── */}
      <section
        className="mk-bg-dark section"
        style={{ paddingTop: 'calc(var(--chrome-h) + var(--s-10))' }}
        aria-labelledby="city-hub-h1"
      >
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '720px' }}>
            <p className="mk-section-overline">
              {n} {n === 1 ? 'Branch' : 'Branches'} · {city} · Est. 2014
            </p>

            <h1
              id="city-hub-h1"
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                margin: '0.5rem 0 1rem',
                lineHeight: 1.1,
              }}
            >
              Sell Gold in {city}
              <span style={{ color: 'rgba(255,255,255,0.30)' }}> | </span>
              <span style={{ color: 'var(--gold)' }}>MK Gold {city}</span>
            </h1>

            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.72)',
                margin: '0 0 2rem',
                lineHeight: 1.65,
              }}
            >
              {n} {n === 1 ? 'branch' : 'branches'} across {city}. Same process. Same promise.
            </p>

            <div className="mk-hub-hero-ctas">
              <a href="#branch-list" className="btn btn-gold">
                Find My Nearest Branch
              </a>
              <a href="#rate" className="btn btn-outline-light">
                See Today&apos;s Rate
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Rate Banner ─────────────────────────────────── */}
      <div
        id="rate"
        className="mk-hub-rate-banner"
        aria-label="Live gold rate banner"
      >
        <div className="mk-container mk-hub-rate-banner__inner">
          <span className="mk-hub-rate-banner__label">Live rate — updated every 5 min</span>
          <MkRateWidget variant="compact" />
          <a
            href="/gold-rate-today"
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-xs)',
              color: 'rgba(255,255,255,0.50)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color var(--t-fast)',
            }}
          >
            Full rate page
          </a>
        </div>
      </div>

      {/* ── Branch List ─────────────────────────────────── */}
      <section className="mk-bg-light section" id="branch-list">
        <div className="mk-container">
          <div className="reveal" style={{ marginBottom: 'var(--s-8)' }}>
            <MkSectionHeader
              tag={`${n} ${n === 1 ? 'Branch' : 'Branches'} in ${city}`}
              title="Find the one nearest you"
              subtitle="Walk in anytime. No appointment needed. 9:30 AM to 7:00 PM, Monday to Saturday."
            />
          </div>

          <div className="mk-branch-grid">
            {branches.map((branch, i) => (
              <article
                key={branch.slug}
                className={`mk-card mk-card--gallery mk-branch-card reveal delay-${Math.min(i + 1, 6)}`}
              >
                <div className="mk-branch-card__body">
                  <h2 className="mk-branch-card__name">{branch.area}</h2>
                  <p className="mk-branch-card__address">{branch.address}</p>
                  <div className="mk-branch-card__meta">
                    <span className="mk-branch-card__hours">
                      {branch.openHours.days} · {branch.openHours.time}
                    </span>
                  </div>
                  <a href={`tel:${branch.phone.replace(/\s/g, '')}`} className="mk-branch-card__phone">
                    {branch.phone}
                  </a>
                </div>
                <div className="mk-branch-card__footer">
                  <a
                    href={`/${branch.slug}`}
                    className="btn btn-plum mk-branch-card__directions"
                  >
                    View Branch
                  </a>
                  <a
                    href={mapsUrl(branch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-plum mk-branch-card__whatsapp"
                  >
                    Directions
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Area SEO Link Grid ──────────────────────────── */}
      <section
        className="section"
        style={{ background: 'var(--white)', paddingTop: 'var(--s-6)', paddingBottom: 'var(--s-8)' }}
      >
        <div className="mk-container">
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: 'var(--t-sm)',
              fontWeight: 600,
              color: 'var(--ink-mid)',
              margin: '0 0 var(--s-3)',
            }}
          >
            Sell gold in a specific area of {city}:
          </p>
          <div className="mk-hub-pill-grid" aria-label={`MK Gold branch areas in ${city}`}>
            {branches.map(branch => (
              <a
                key={branch.slug}
                href={`/${branch.slug}`}
                className="mk-hub-pill"
              >
                {branch.area}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────── */}
      <MkSteps />

      {/* ── Testimonials ────────────────────────────────── */}
      <section className="mk-bg-light section">
        <div className="mk-container">
          <div className="mk-reviews__header reveal">
            <p className="mk-section-overline">Customer Reviews</p>
            <div className="mk-reviews__aggregate">
              <span className="mk-reviews__aggregate-score">4.9</span>
              <div className="mk-reviews__aggregate-right">
                <Stars rating={5} />
                <p className="mk-reviews__aggregate-count">
                  Based on 200+ Google Reviews
                </p>
              </div>
            </div>
          </div>

          <div className="mk-reviews__grid">
            {testimonials.map((r, i) => (
              <article
                key={r.author}
                className={`mk-review-card reveal delay-${i + 1}`}
                aria-label={`Review by ${r.author}`}
              >
                <Stars rating={r.rating} />
                <span className="mk-review-card__deco-quote" aria-hidden="true">&ldquo;</span>
                <blockquote className="mk-review-card__quote">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <footer className="mk-review-card__footer">
                  <div className="mk-review-card__author-row">
                    <div className="mk-review-card__avatar" aria-hidden="true">
                      {r.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="mk-review-card__author-info">
                      <strong className="mk-review-card__author">{r.author}</strong>
                      <span className="mk-review-card__meta">
                        {r.location} &middot; {r.date}
                      </span>
                    </div>
                  </div>
                  <span className="mk-review-card__source" aria-label="Source: Google">
                    Google
                  </span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── City FAQ ────────────────────────────────────── */}
      <CityFaq faqs={faqs} idPrefix={`city-${city.toLowerCase()}`} />

      {/* ── CTA Band + Footer ───────────────────────────── */}
      <MkCtaBand />
      <MkFooter />
    </main>
  );
}
