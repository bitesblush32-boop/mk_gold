'use client';

// N16 — Dynamic branch finder: city tabs + area search + geolocation

import { useState, useMemo } from 'react';
import { BRANCHES, findNearestBranch, type Branch } from '@/lib/branch-router';
import { MkButton } from '@/components/ui/MkButton';

/* ─── Types ──────────────────────────────────────────────────── */

type GeoState = 'idle' | 'loading' | 'found' | 'denied';
const CITIES = ['All', 'Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = (typeof CITIES)[number];

/* ─── Branch card ────────────────────────────────────────────── */

function BranchCard({
  branch,
  highlighted,
}: {
  branch: Branch;
  highlighted: boolean;
}) {
  return (
    <article
      className="mk-bf-card"
      style={
        highlighted
          ? {
              outline: '2px solid var(--gold)',
              boxShadow: '0 0 0 4px rgba(223,193,96,0.15)',
            }
          : undefined
      }
    >
      <div className="mk-bf-card__header">
        <h3 className="mk-bf-card__name">{branch.name}</h3>
        <span className="mk-bf-card__city">{branch.city}</span>
      </div>
      {highlighted && (
        <p
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontSize: 'var(--t-2xs)',
            fontWeight: 700,
            color: 'var(--gold-deep)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: '0 0 0.5rem',
          }}
        >
          Nearest to you
        </p>
      )}
      <address className="mk-bf-card__address">{branch.address}</address>
      <div className="mk-bf-card__hours">
        {branch.openHours.days} &middot; {branch.openHours.time}
      </div>
      <div className="mk-bf-card__actions">
        <MkButton variant="plum" size="sm" href={`tel:${branch.phone}`}>
          Call Branch
        </MkButton>
        <MkButton
          variant="whatsapp"
          size="sm"
          href={`https://wa.me/${branch.whatsapp.replace('+', '')}`}
          external
        >
          WhatsApp
        </MkButton>
        <MkButton variant="outline-plum" size="sm" href={`/${branch.slug}`}>
          Branch Page
        </MkButton>
      </div>
    </article>
  );
}

/* ─── Main component ─────────────────────────────────────────── */

export function MkBranchFinder() {
  const [city, setCity] = useState<City>('Bangalore');
  const [search, setSearch] = useState('');
  const [geoState, setGeoState] = useState<GeoState>('idle');
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);

  function handleGeoLocate() {
    if (!navigator.geolocation) {
      setGeoState('denied');
      return;
    }
    setGeoState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = findNearestBranch(
          pos.coords.latitude,
          pos.coords.longitude,
        );
        setCity(nearest.city as City);
        setSearch('');
        setHighlightedSlug(nearest.slug);
        setGeoState('found');
      },
      () => {
        setGeoState('denied');
      },
      { timeout: 8000 },
    );
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return BRANCHES.filter((b) => {
      const cityMatch = city === 'All' || b.city === city;
      const searchMatch =
        !term ||
        b.area.toLowerCase().includes(term) ||
        b.name.toLowerCase().includes(term) ||
        b.address.toLowerCase().includes(term);
      return cityMatch && searchMatch;
    });
  }, [city, search]);

  return (
    <>
      <style>{`
        @keyframes mkGeoPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        .mk-geo-loading { animation: mkGeoPulse 1.4s ease-in-out infinite; }
      `}</style>

      <section className="mk-branch-finder mk-bg-light section" id="branches">
        <div className="mk-container">

          {/* Header */}
          <div className="mk-branch-finder__header reveal">
            <p className="mk-section-overline">16 Branches</p>
            <h2 className="mk-branch-finder__title">
              Find a branch near you
            </h2>
            <p className="mk-branch-finder__subtitle">
              All branches are open Monday to Saturday, 9:30 AM – 7:00 PM.
              Walk-ins always welcome.
            </p>
          </div>

          {/* Geo row — above city tabs */}
          <div
            style={{
              textAlign: 'center',
              minHeight: '2rem',
              marginBottom: '0.75rem',
            }}
          >
            {geoState === 'idle' && (
              <button
                onClick={handleGeoLocate}
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: 'var(--t-sm)',
                  color: 'var(--gold-deep)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem 0',
                  textDecoration: 'underline',
                  textDecorationColor: 'rgba(201,169,64,0.4)',
                  textUnderlineOffset: '3px',
                }}
              >
                Use my location
              </button>
            )}
            {geoState === 'loading' && (
              <span
                className="mk-geo-loading"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  color: 'var(--ink-mid)',
                  fontStyle: 'italic',
                }}
              >
                Finding nearest branch...
              </span>
            )}
            {geoState === 'denied' && (
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'var(--t-sm)',
                  color: 'var(--mist)',
                }}
              >
                Please select your city below.
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="mk-branch-finder__controls reveal delay-1">

            {/* City tabs */}
            <div
              className="mk-branch-finder__city-tabs"
              role="tablist"
              aria-label="Filter branches by city"
            >
              {CITIES.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={city === c}
                  className={`mk-bf-tab${city === c ? ' mk-bf-tab--active' : ''}`}
                  onClick={() => {
                    setCity(c);
                    setHighlightedSlug(null);
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Area search */}
            <input
              type="search"
              className="mk-input mk-branch-finder__search"
              placeholder="Search by area e.g. Rajajinagar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search branches by area"
            />
          </div>

          {/* Results */}
          {filtered.length > 0 ? (
            <div
              className="mk-branch-finder__grid"
              role="list"
              aria-label={`${filtered.length} branch${filtered.length !== 1 ? 'es' : ''} found`}
            >
              {filtered.map((b) => (
                <div key={b.slug} role="listitem">
                  <BranchCard
                    branch={b}
                    highlighted={b.slug === highlightedSlug}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="mk-branch-finder__empty">
              No branches found for &ldquo;{search}&rdquo;.{' '}
              <button
                className="mk-branch-finder__reset"
                onClick={() => {
                  setSearch('');
                  setCity('All');
                  setHighlightedSlug(null);
                }}
              >
                Clear search
              </button>
            </p>
          )}

        </div>
      </section>
    </>
  );
}
