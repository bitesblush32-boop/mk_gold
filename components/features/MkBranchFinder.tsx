'use client';

// N16 — Dynamic branch finder by city + area search

import { useState, useMemo } from 'react';
import { BRANCHES, type Branch } from '@/lib/branch-router';
import { MkButton } from '@/components/ui/MkButton';

/* ─── City list ───────────────────────────────────────────────── */

const CITIES = ['All', 'Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = (typeof CITIES)[number];

/* ─── Branch card ─────────────────────────────────────────────── */

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <article className="mk-bf-card">
      <div className="mk-bf-card__header">
        <h3 className="mk-bf-card__name">{branch.name}</h3>
        <span className="mk-bf-card__city">{branch.city}</span>
      </div>
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
        <MkButton
          variant="outline-plum"
          size="sm"
          href={`/${branch.slug}`}
        >
          Branch Page
        </MkButton>
      </div>
    </article>
  );
}

/* ─── Main component ──────────────────────────────────────────── */

export function MkBranchFinder() {
  const [city,   setCity]   = useState<City>('Bangalore');
  const [search, setSearch] = useState('');

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
                onClick={() => setCity(c)}
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
                <BranchCard branch={b} />
              </div>
            ))}
          </div>
        ) : (
          <p className="mk-branch-finder__empty">
            No branches found for &ldquo;{search}&rdquo;.{' '}
            <button
              className="mk-branch-finder__reset"
              onClick={() => { setSearch(''); setCity('All'); }}
            >
              Clear search
            </button>
          </p>
        )}

      </div>
    </section>
  );
}
