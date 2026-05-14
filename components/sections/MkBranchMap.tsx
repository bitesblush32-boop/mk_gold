// F18 — Branch map: SVG Karnataka outline with city markers

/* ─── City data ───────────────────────────────────────────────── */

const CITIES = [
  {
    name: 'Bangalore',
    branches: 10,
    active: true,
    // Approximate SVG coords within the Karnataka outline below (viewBox 0 0 400 500)
    cx: 230, cy: 310,
    href: '/sell-gold-bangalore',
  },
  {
    name: 'Mysore',
    branches: 3,
    active: false,
    cx: 195, cy: 355,
    href: '/sell-gold-mysore',
  },
  {
    name: 'Mangalore',
    branches: 2,
    active: false,
    cx: 130, cy: 345,
    href: '/sell-gold-mangalore',
  },
  {
    name: 'Davangere',
    branches: 1,
    active: false,
    cx: 190, cy: 240,
    href: '/sell-gold-davangere',
  },
] as const;

/* ─── Component ───────────────────────────────────────────────── */

export function MkBranchMap() {
  return (
    <section className="mk-bg-light section" id="branches" aria-label="MK Gold branch locations in Karnataka">
      <div className="mk-container">

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p className="mk-section-overline">Our Presence</p>
          <h2 style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h2)', color: 'var(--ink)', lineHeight: 1.1, margin: '0.5rem 0 1rem' }}>
            16 branches across Karnataka
          </h2>
          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', maxWidth: '480px', margin: '0 auto' }}>
            Bangalore is fully operational. Other cities coming soon.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '3rem', justifyContent: 'center' }}>

          {/* SVG Karnataka map */}
          <div style={{ flex: '0 0 auto', maxWidth: '360px', width: '100%' }}>
            <svg
              viewBox="0 0 400 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Map of Karnataka showing MK Gold branch cities"
              style={{ width: '100%', height: 'auto' }}
            >
              {/* Karnataka state outline — simplified polygon */}
              <path
                d="M120,40 L160,30 L210,45 L260,38 L310,60 L330,95 L345,130 L340,165 L360,195 L355,230 L340,260 L320,285 L295,310 L275,340 L255,365 L240,390 L220,410 L200,430 L185,415 L175,390 L160,370 L145,350 L125,325 L105,295 L90,265 L80,235 L75,200 L80,170 L70,140 L80,110 L95,80 Z"
                fill="var(--gallery)"
                stroke="var(--gallery-dk)"
                strokeWidth="2"
              />

              {/* Inactive cities — label only, no pin */}
              {CITIES.filter(c => !c.active).map(city => (
                <g key={city.name}>
                  <text
                    x={city.cx}
                    y={city.cy - 8}
                    textAnchor="middle"
                    fontFamily="Poppins, sans-serif"
                    fontSize="11"
                    fontWeight="500"
                    fill="var(--ink-mid)"
                  >
                    {city.name}
                  </text>
                  <text
                    x={city.cx}
                    y={city.cy + 8}
                    textAnchor="middle"
                    fontFamily="Poppins, sans-serif"
                    fontSize="9"
                    fontWeight="600"
                    fill="var(--mist)"
                    letterSpacing="0.06em"
                  >
                    COMING SOON
                  </text>
                </g>
              ))}

              {/* Active city — Bangalore with gold marker */}
              {CITIES.filter(c => c.active).map(city => (
                <g key={city.name}>
                  {/* Pulse ring */}
                  <circle cx={city.cx} cy={city.cy} r="18" fill="var(--gold)" opacity="0.15">
                    <animate attributeName="r" values="14;22;14" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.15;0.05;0.15" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Marker dot */}
                  <circle cx={city.cx} cy={city.cy} r="8" fill="var(--gold)" />
                  <circle cx={city.cx} cy={city.cy} r="4" fill="var(--plum)" />
                  {/* Label */}
                  <text
                    x={city.cx + 14}
                    y={city.cy - 4}
                    fontFamily="Tanker, serif"
                    fontSize="14"
                    fill="var(--ink)"
                  >
                    {city.name}
                  </text>
                  <text
                    x={city.cx + 14}
                    y={city.cy + 11}
                    fontFamily="Poppins, sans-serif"
                    fontSize="10"
                    fontWeight="500"
                    fill="var(--gold-deep)"
                  >
                    {city.branches} branches
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* City legend cards */}
          <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '380px' }}>
            {CITIES.map(city => (
              <div
                key={city.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--r-xl)',
                  background: city.active ? 'var(--plum)' : 'white',
                  border: city.active ? 'none' : '1px solid var(--gallery-dk)',
                  opacity: city.active ? 1 : 0.8,
                }}
              >
                {/* Dot */}
                <div style={{
                  width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0,
                  background: city.active ? 'var(--gold)' : 'var(--gallery-dk)',
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 'var(--t-sm)', color: city.active ? 'white' : 'var(--ink)', margin: 0, lineHeight: 1.3 }}>
                    {city.name}
                  </p>
                  <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: city.active ? 'var(--gold)' : 'var(--mist)', margin: 0, marginTop: '0.125rem' }}>
                    {city.active ? `${city.branches} branches · Open now` : 'Coming Soon'}
                  </p>
                </div>
                {city.active && (
                  <a
                    href={city.href}
                    style={{
                      fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', fontWeight: 600,
                      color: 'var(--gold)', textDecoration: 'none', whiteSpace: 'nowrap',
                      letterSpacing: '0.04em',
                    }}
                  >
                    View branches
                  </a>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
