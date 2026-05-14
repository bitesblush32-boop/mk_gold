import type { Metadata } from 'next';
import { BRANCHES } from '@/lib/branch-router';
import type { Branch } from '@/lib/branch-router';
import { MkNavbar }        from '@/components/layout/MkNavbar';
import { MkFooter }        from '@/components/layout/MkFooter';
import { MkBranchFinder }  from '@/components/features/MkBranchFinder';
import { MkSectionHeader } from '@/components/ui/MkSectionHeader';
import { AppointmentForm } from './AppointmentForm';

export const metadata: Metadata = {
  title: 'Contact MK Gold | 16 Branches | Karnataka',
  description:
    'Find your nearest MK Gold branch. 16 locations across Bangalore, Mysore, Mangalore and Davangere. Walk in or book an appointment.',
  alternates: { canonical: 'https://mkgold.in/contact' },
  openGraph: {
    title: 'Contact MK Gold | 16 Branches | Karnataka',
    description:
      'Find your nearest MK Gold branch. 16 locations across Bangalore, Mysore, Mangalore and Davangere. Walk in or book an appointment.',
    url: 'https://mkgold.in/contact',
    siteName: 'MK Gold',
    locale: 'en_IN',
    type: 'website',
  },
  robots: { index: true, follow: true },
};

/* Group branches by city in display order */
const CITY_ORDER: Branch['city'][] = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'];
const branchesByCity = CITY_ORDER.map(city => ({
  city,
  branches: BRANCHES.filter(b => b.city === city),
}));

/* Google Maps directions URL */
function mapsUrl(branch: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    branch.name + ' ' + branch.address
  )}`;
}

export default function ContactPage() {
  return (
    <main>
      <MkNavbar />

      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        className="mk-bg-dark section"
        style={{ paddingTop: 'calc(var(--chrome-h) + var(--s-10))' }}
      >
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '700px' }}>
            <p className="mk-section-overline">16 Branches · 4 Cities</p>
            <h1
              style={{
                fontFamily: 'Tanker, serif',
                fontSize: 'var(--t-h1)',
                color: 'var(--white)',
                margin: '0.5rem 0 1rem',
                lineHeight: 1.1,
              }}
            >
              Find Your Nearest
              <br />
              <span style={{ color: 'var(--gold)' }}>MK Gold Branch</span>
            </h1>
            <p
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-lg)',
                color: 'rgba(255,255,255,0.72)',
                margin: 0,
              }}
            >
              Walk in anytime during branch hours — no appointment needed.
              Enter your pin code below to find the branch closest to you.
            </p>
          </div>

          {/* Quick stats row */}
          <div className="mk-contact-stats reveal delay-1">
            {[
              { value: '16', label: 'Branches' },
              { value: '4',  label: 'Cities' },
              { value: '45 min', label: 'Avg. payout time' },
              { value: 'Mon – Sat', label: '9:30 AM – 7:00 PM' },
            ].map(s => (
              <div key={s.label} className="mk-contact-stat">
                <span className="mk-contact-stat__value">{s.value}</span>
                <span className="mk-contact-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Branch Finder ─────────────────────────────────── */}
      <section className="mk-bg-light section" id="branch-finder">
        <div className="mk-container">
          <div className="reveal" style={{ marginBottom: 'var(--s-6)' }}>
            <MkSectionHeader
              tag="Branch Finder"
              title="Find by pin code"
              subtitle="Enter your pin code or area name — we'll show the nearest branch with directions."
            />
          </div>
          <div className="reveal delay-1">
            <MkBranchFinder />
          </div>
        </div>
      </section>

      {/* ── Appointment Form ──────────────────────────────── */}
      <section className="section" id="book-appointment" style={{ background: 'var(--white)' }}>
        <div className="mk-container">
          <div className="reveal" style={{ marginBottom: 'var(--s-8)' }}>
            <MkSectionHeader
              tag="Book Ahead"
              title="Reserve your slot"
              subtitle="Prefer a specific time? Request a slot and skip the wait. Walk-ins are equally welcome."
            />
          </div>
          <div className="mk-appt-wrap reveal delay-1">
            <AppointmentForm />
          </div>
        </div>
      </section>

      {/* ── Branch Grid ───────────────────────────────────── */}
      <section className="mk-bg-light section" id="all-branches">
        <div className="mk-container">
          <div className="reveal" style={{ marginBottom: 'var(--s-8)' }}>
            <MkSectionHeader
              tag="All Branches"
              title="Every MK Gold location"
              subtitle="All branches open Monday to Saturday, 9:30 AM to 7:00 PM. Walk-ins welcome."
            />
          </div>

          {branchesByCity.map(({ city, branches }, ci) => (
            <div key={city} className={`mk-city-section${ci > 0 ? ' mk-city-section--mt' : ''}`}>
              {/* City heading */}
              <div className="mk-city-heading reveal">
                <h2 className="mk-city-heading__name">{city}</h2>
                <span className="mk-city-heading__count">
                  {branches.length} {branches.length === 1 ? 'branch' : 'branches'}
                </span>
                <div className="mk-city-heading__line" aria-hidden="true" />
              </div>

              {/* Branch cards */}
              <div className="mk-branch-grid">
                {branches.map((branch, bi) => (
                  <article
                    key={branch.slug}
                    className={`mk-card mk-card--gallery mk-branch-card reveal delay-${Math.min(bi + 1, 6)}`}
                  >
                    <div className="mk-branch-card__body">
                      <h3 className="mk-branch-card__name">{branch.area}</h3>
                      <p className="mk-branch-card__address">{branch.address}</p>

                      <div className="mk-branch-card__meta">
                        <span className="mk-branch-card__hours">
                          {branch.openHours.days} · {branch.openHours.time}
                        </span>
                      </div>

                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="mk-branch-card__phone"
                      >
                        {branch.phone}
                      </a>
                    </div>

                    <div className="mk-branch-card__footer">
                      <a
                        href={mapsUrl(branch)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-plum mk-branch-card__directions"
                      >
                        Get Directions
                      </a>
                      <a
                        href={`https://wa.me/${branch.whatsapp.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-whatsapp mk-branch-card__whatsapp"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <MkFooter />
    </main>
  );
}
