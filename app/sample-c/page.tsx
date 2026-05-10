'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkStatBand } from '@/components/sections/MkStatBand';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkTrust } from '@/components/sections/MkTrust';
import { MkFaq } from '@/components/sections/MkFaq';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { MkWhatsApp } from '@/components/features/MkWhatsApp';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkCalculator } from '@/components/features/MkCalculator';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { BRANCHES } from '@/lib/branch-router';
import { useGoldRate } from '@/hooks/useGoldRate';

/* ─── Hero slides ─────────────────────────────────────────────── */

const SLIDES = [
  {
    bg: '/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg',
    headline: 'Sell Your Gold Today',
    headlineKn: 'ನಿಮ್ಮ ಚಿನ್ನವನ್ನು ಇಂದೇ ಮಾರಿ',
    sub: 'Live MCX rates · XRF purity test · Payment in 45 minutes',
  },
  {
    bg: '/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg',
    headline: 'Karnataka\'s Most Trusted Gold Buyer',
    headlineKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಚಿನ್ನ ಖರೀದಿದಾರ',
    sub: '16 branches · 10,000+ customers · Est. 2014',
  },
  {
    bg: '/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg',
    headline: 'Release Pledged Gold Confidentially',
    headlineKn: 'ಗೋಪ್ಯವಾಗಿ ಅಡಮಾನ ಚಿನ್ನ ಬಿಡಿಸಿ',
    sub: 'We pay your lender directly · Discreet · Same-day possible',
  },
  {
    bg: '/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg',
    headline: 'Fair Value. Every Time.',
    headlineKn: 'ನ್ಯಾಯಯುತ ಮೌಲ್ಯ. ಪ್ರತಿ ಬಾರಿ.',
    sub: 'ISO 9001:2015 · German XRF Spectrometer · Transparent pricing',
  },
  {
    bg: '/858b4896-10-easy-ways-to-know-if-your-gold-jewellery-is-real.jpg',
    headline: 'Instant Money, Lasting Trust',
    headlineKn: 'ತಕ್ಷಣ ಹಣ, ಶಾಶ್ವತ ವಿಶ್ವಾಸ',
    sub: 'Bangalore · Mysore · Mangalore · Davangere',
  },
];

/* ─── Chart data (12-year gold price history ─ illustrative) ──── */

const CHART_DATA = [
  { year: '2014', price: 26500 },
  { year: '2015', price: 24800 },
  { year: '2016', price: 28200 },
  { year: '2017', price: 29100 },
  { year: '2018', price: 30400 },
  { year: '2019', price: 35800 },
  { year: '2020', price: 48500 },
  { year: '2021', price: 44200 },
  { year: '2022', price: 52100 },
  { year: '2023', price: 58400 },
  { year: '2024', price: 71200 },
  { year: '2025', price: 88600 },
];

/* ─── Testimonials ────────────────────────────────────────────── */

const TESTIMONIALS = [
  {
    name: 'Suresh Kumar',
    area: 'Rajajinagar, Bangalore',
    rating: 5,
    text: 'Got the best rate for my 22K jewellery. The XRF test was done in front of me and payment was within 30 minutes. Very transparent process.',
    initials: 'SK',
  },
  {
    name: 'Kavitha Nair',
    area: 'Gokulam, Mysore',
    rating: 5,
    text: 'MK Gold helped me release my pledged gold from the bank without any hassle. They handled everything professionally and confidentially.',
    initials: 'KN',
  },
  {
    name: 'Mohammed Rafiq',
    area: 'Mangalore City',
    rating: 5,
    text: 'Excellent service. The staff explained the MCX rate and exactly how they calculated my gold value. Nothing hidden. Would recommend to everyone.',
    initials: 'MR',
  },
  {
    name: 'Anitha Reddy',
    area: 'Koramangala, Bangalore',
    rating: 5,
    text: 'I was worried about getting a fair price but MK Gold showed me the live MCX rate and their margin side by side. Complete transparency.',
    initials: 'AR',
  },
  {
    name: 'Vijay Shetty',
    area: 'Kadri, Mangalore',
    rating: 5,
    text: '11 years in business means they know what they are doing. Fast, honest, professional. Got payment immediately after the test.',
    initials: 'VS',
  },
  {
    name: 'Priya Sharma',
    area: 'Davangere',
    rating: 5,
    text: 'The branch team was very respectful and patient. They explained everything clearly. The German XRF machine gives accurate results instantly.',
    initials: 'PS',
  },
];

/* ─── City branch data ────────────────────────────────────────── */

const CITIES = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = typeof CITIES[number];

/* ─── SVG Area Chart ──────────────────────────────────────────── */

function GoldRateChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<'5yr' | '10yr' | 'all'>('all');

  const filtered = filter === '5yr'
    ? CHART_DATA.slice(-5)
    : filter === '10yr'
    ? CHART_DATA.slice(-10)
    : CHART_DATA;

  const W = 600;
  const H = 220;
  const PAD = { top: 20, right: 20, bottom: 36, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const minP = Math.min(...filtered.map(d => d.price));
  const maxP = Math.max(...filtered.map(d => d.price));
  const range = maxP - minP || 1;

  const px = (i: number) => PAD.left + (i / (filtered.length - 1)) * chartW;
  const py = (p: number) => PAD.top + chartH - ((p - minP) / range) * chartH;

  const linePath = filtered.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(d.price)}`).join(' ');
  const areaPath = `${linePath} L${px(filtered.length - 1)},${PAD.top + chartH} L${px(0)},${PAD.top + chartH} Z`;

  const yTicks = 4;
  const yTickVals = Array.from({ length: yTicks + 1 }, (_, i) => minP + (range / yTicks) * i);

  return (
    <div style={{ position: 'relative' }}>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'flex-end' }}>
        {(['5yr', '10yr', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.25rem 0.875rem',
              borderRadius: '9999px',
              border: '1.5px solid',
              borderColor: filter === f ? 'var(--gold)' : 'rgba(223,193,96,0.3)',
              background: filter === f ? 'var(--gold)' : 'transparent',
              color: filter === f ? 'var(--plum)' : 'var(--gold)',
              cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}
          >
            {f === 'all' ? 'All Years' : f === '5yr' ? '5 Years' : '10 Years'}
          </button>
        ))}
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        aria-label="Gold price history chart"
      >
        <defs>
          <linearGradient id="sc-area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#DFC160" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#DFC160" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y grid lines */}
        {yTickVals.map((v, i) => (
          <g key={i}>
            <line
              x1={PAD.left} y1={py(v)}
              x2={PAD.left + chartW} y2={py(v)}
              stroke="rgba(223,193,96,0.12)" strokeWidth="1"
            />
            <text
              x={PAD.left - 8} y={py(v) + 4}
              textAnchor="end"
              style={{ fontFamily: 'Poppins,sans-serif', fontSize: '10px', fill: 'rgba(223,193,96,0.55)' }}
            >
              {(v / 1000).toFixed(0)}K
            </text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#sc-area-grad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#DFC160" strokeWidth="2" strokeLinejoin="round" />

        {/* X labels */}
        {filtered.map((d, i) => {
          const skip = filtered.length > 8 ? i % 2 !== 0 : false;
          return !skip ? (
            <text
              key={d.year}
              x={px(i)} y={H - 6}
              textAnchor="middle"
              style={{ fontFamily: 'Poppins,sans-serif', fontSize: '10px', fill: 'rgba(223,193,96,0.55)' }}
            >
              {d.year}
            </text>
          ) : null;
        })}

        {/* Hover dots + tooltip */}
        {filtered.map((d, i) => (
          <g key={d.year}>
            <circle
              cx={px(i)} cy={py(d.price)} r={hoveredIdx === i ? 5 : 3}
              fill={hoveredIdx === i ? '#DFC160' : '#7B2C91'}
              stroke="#DFC160" strokeWidth="1.5"
              style={{ cursor: 'pointer', transition: 'r var(--t-fast)' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
            {hoveredIdx === i && (
              <g>
                <rect
                  x={px(i) - 44} y={py(d.price) - 38}
                  width="88" height="28"
                  rx="6" fill="#3B1848"
                  stroke="rgba(223,193,96,0.4)" strokeWidth="1"
                />
                <text
                  x={px(i)} y={py(d.price) - 20}
                  textAnchor="middle"
                  style={{ fontFamily: 'Poppins,sans-serif', fontSize: '11px', fontWeight: '600', fill: '#DFC160' }}
                >
                  ₹{d.price.toLocaleString('en-IN')}/10g
                </text>
                <text
                  x={px(i)} y={py(d.price) - 8}
                  textAnchor="middle"
                  style={{ fontFamily: 'Poppins,sans-serif', fontSize: '9px', fill: 'rgba(255,255,255,0.6)' }}
                >
                  {d.year}
                </text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Callback form ───────────────────────────────────────────── */

function CallbackForm() {
  const [form, setForm] = useState({
    name: '', phone: '', goldType: '', weight: '', city: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'sample-c-callback' }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '2px solid var(--gold)', margin: '0 auto 1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Tanker, serif', fontSize: '1.5rem', color: 'var(--gold)',
        }}>
          MK
        </div>
        <h3 style={{ fontFamily: 'Tanker, serif', color: 'var(--gold)', fontSize: 'var(--t-h3)', marginBottom: '0.5rem' }}>
          We will call you back
        </h3>
        <p style={{ fontFamily: 'Poppins, sans-serif', color: 'rgba(255,255,255,0.7)', fontSize: 'var(--t-sm)' }}>
          Our team will contact you within 30 minutes during business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Your Name</label>
          <input
            type="text" required
            className="mk-input mk-input--dark"
            placeholder="Full name"
            value={form.name} onChange={set('name')}
          />
        </div>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Phone Number</label>
          <input
            type="tel" required pattern="[6-9][0-9]{9}"
            className="mk-input mk-input--dark"
            placeholder="10-digit mobile"
            value={form.phone} onChange={set('phone')}
          />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Gold Type</label>
          <select className="mk-select mk-select--dark" value={form.goldType} onChange={set('goldType')}>
            <option value="">Select type</option>
            <option value="jewellery">Jewellery</option>
            <option value="coins">Gold Coins</option>
            <option value="bars">Gold Bars</option>
            <option value="broken">Broken / Scrap</option>
            <option value="pledged">Pledged Gold</option>
          </select>
        </div>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Approx. Weight (g)</label>
          <input
            type="number" min="0.1" step="0.1"
            className="mk-input mk-input--dark"
            placeholder="e.g. 10"
            value={form.weight} onChange={set('weight')}
          />
        </div>
      </div>
      <div>
        <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Nearest City</label>
        <select className="mk-select mk-select--dark" value={form.city} onChange={set('city')}>
          <option value="">Select city</option>
          <option value="bangalore">Bangalore</option>
          <option value="mysore">Mysore</option>
          <option value="mangalore">Mangalore</option>
          <option value="davangere">Davangere</option>
        </select>
      </div>
      <MkButton
        type="submit"
        variant="gold"
        size="lg"
        style={{ width: '100%', marginTop: '0.5rem' }}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…' : 'Request Callback'}
      </MkButton>
      {status === 'error' && (
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: '#f87171', textAlign: 'center' }}>
          Something went wrong. Please WhatsApp us directly.
        </p>
      )}
    </form>
  );
}

/* ─── Branch Finder ───────────────────────────────────────────── */

function BranchFinder() {
  const [activeCity, setActiveCity] = useState<City>('Bangalore');
  const [expanded, setExpanded] = useState<string | null>(null);

  const cityBranches = BRANCHES.filter(b =>
    b.city.toLowerCase() === activeCity.toLowerCase()
  );

  const cityArt: Record<City, React.ReactNode> = {
    Bangalore: (
      <svg viewBox="0 0 120 80" style={{ width: '100%', height: 'auto', opacity: 0.25 }}>
        <rect x="20" y="20" width="30" height="50" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <rect x="25" y="25" width="8" height="10" fill="#DFC160" opacity="0.4" />
        <rect x="37" y="25" width="8" height="10" fill="#DFC160" opacity="0.4" />
        <rect x="25" y="40" width="8" height="10" fill="#DFC160" opacity="0.4" />
        <rect x="37" y="40" width="8" height="10" fill="#DFC160" opacity="0.4" />
        <rect x="30" y="55" width="10" height="15" fill="#7B2C91" opacity="0.5" />
        <rect x="60" y="30" width="20" height="40" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="60,30 70,18 80,30" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <rect x="65" y="45" width="10" height="15" fill="#7B2C91" opacity="0.5" />
        <rect x="88" y="35" width="18" height="35" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <rect x="91" y="40" width="5" height="7" fill="#DFC160" opacity="0.4" />
        <rect x="99" y="40" width="5" height="7" fill="#DFC160" opacity="0.4" />
        <line x1="10" y1="70" x2="110" y2="70" stroke="#DFC160" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
    Mysore: (
      <svg viewBox="0 0 120 80" style={{ width: '100%', height: 'auto', opacity: 0.25 }}>
        <rect x="35" y="25" width="50" height="45" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="60,10 95,25 25,25" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="60,14 90,25 30,25" fill="#7B2C91" opacity="0.3" />
        {[45,55,65,75].map(x => (
          <rect key={x} x={x} y="45" width="8" height="25" fill="#DFC160" opacity="0.2" />
        ))}
        <line x1="10" y1="70" x2="110" y2="70" stroke="#DFC160" strokeWidth="1" opacity="0.4" />
        <circle cx="60" cy="18" r="3" fill="#DFC160" opacity="0.6" />
      </svg>
    ),
    Mangalore: (
      <svg viewBox="0 0 120 80" style={{ width: '100%', height: 'auto', opacity: 0.25 }}>
        <path d="M10 65 Q30 30 50 55 Q70 75 90 40 Q100 25 110 45" fill="none" stroke="#DFC160" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="50" cy="55" r="4" fill="#DFC160" opacity="0.5" />
        <circle cx="90" cy="40" r="4" fill="#DFC160" opacity="0.5" />
        <path d="M50 55 L50 35 M90 40 L90 20" stroke="#DFC160" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        <text x="44" y="30" style={{ fontFamily: 'Poppins', fontSize: '7px', fill: '#DFC160', opacity: 0.7 }}>Harbor</text>
        <text x="84" y="16" style={{ fontFamily: 'Poppins', fontSize: '7px', fill: '#DFC160', opacity: 0.7 }}>Kadri</text>
      </svg>
    ),
    Davangere: (
      <svg viewBox="0 0 120 80" style={{ width: '100%', height: 'auto', opacity: 0.25 }}>
        <circle cx="60" cy="40" r="30" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <circle cx="60" cy="40" r="20" fill="none" stroke="#7B2C91" strokeWidth="1" />
        <circle cx="60" cy="40" r="8" fill="#DFC160" opacity="0.2" />
        <line x1="60" y1="10" x2="60" y2="70" stroke="#DFC160" strokeWidth="0.8" opacity="0.3" />
        <line x1="30" y1="40" x2="90" y2="40" stroke="#DFC160" strokeWidth="0.8" opacity="0.3" />
        <circle cx="60" cy="40" r="2" fill="#DFC160" opacity="0.8" />
      </svg>
    ),
  };

  return (
    <section className="mk-bg-dark section" id="branches" aria-label="Branch finder">
      <style>{`
        .sc-city-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2.5rem; }
        @media (max-width: 640px) { .sc-city-grid { grid-template-columns: repeat(2,1fr); } }
        .sc-city-card {
          border: 1.5px solid rgba(223,193,96,0.2);
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          background: rgba(59,24,72,0.4);
          transition: border-color var(--t-base), background var(--t-base), transform var(--t-fast);
          text-align: center;
        }
        .sc-city-card:hover { transform: translateY(-2px); }
        .sc-city-card--active {
          border-color: var(--gold);
          background: rgba(223,193,96,0.08);
        }
        .sc-city-name {
          font-family: 'Tanker', serif;
          font-size: var(--t-h4);
          color: var(--gold);
          margin: 0.5rem 0 0.25rem;
        }
        .sc-city-count {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: var(--mist);
        }
        .sc-branch-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .sc-branch-item {
          border: 1px solid rgba(223,193,96,0.15);
          border-radius: 10px;
          overflow: hidden;
          transition: border-color var(--t-fast);
        }
        .sc-branch-item:hover { border-color: rgba(223,193,96,0.35); }
        .sc-branch-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.875rem 1rem;
          cursor: pointer;
          background: rgba(81,37,97,0.2);
        }
        .sc-branch-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: var(--t-base);
          color: #fff;
        }
        .sc-branch-toggle {
          font-family: 'Tanker', serif;
          font-size: 1.25rem;
          color: var(--gold);
          line-height: 1;
          transform-origin: center;
          transition: transform var(--t-fast);
          display: inline-block;
        }
        .sc-branch-toggle--open { transform: rotate(45deg); }
        .sc-branch-body {
          padding: 0 1rem 1rem;
          background: rgba(59,24,72,0.3);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sc-branch-addr {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--mist);
          line-height: 1.5;
        }
        .sc-branch-actions { display: flex; gap: 0.75rem; margin-top: 0.25rem; flex-wrap: wrap; }
        .sc-branch-action {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          font-weight: 600;
          color: var(--gold);
          text-decoration: none;
          border: 1px solid rgba(223,193,96,0.35);
          padding: 0.3rem 0.875rem;
          border-radius: 9999px;
          transition: background var(--t-fast), color var(--t-fast);
        }
        .sc-branch-action:hover { background: var(--gold); color: var(--plum); }
      `}</style>

      <div className="mk-container">
        <p className="mk-section-overline reveal">16 Branches Across Karnataka</p>
        <h2 className="sc-section-h2 reveal delay-1" style={{
          fontFamily: 'Tanker, serif',
          fontSize: 'var(--t-h2)',
          color: '#fff',
          marginBottom: '2.5rem',
        }}>
          Find Your Nearest MK Gold Branch
        </h2>

        <div className="sc-city-grid reveal delay-2">
          {CITIES.map((city) => {
            const count = BRANCHES.filter(b => b.city.toLowerCase() === city.toLowerCase()).length;
            return (
              <button
                key={city}
                onClick={() => { setActiveCity(city); setExpanded(null); }}
                className={`sc-city-card${activeCity === city ? ' sc-city-card--active' : ''}`}
              >
                <div style={{ width: '100%', maxWidth: '96px', margin: '0 auto' }}>
                  {cityArt[city]}
                </div>
                <p className="sc-city-name">{city}</p>
                <p className="sc-city-count">{count} {count === 1 ? 'branch' : 'branches'}</p>
              </button>
            );
          })}
        </div>

        <div className="sc-branch-list reveal delay-3">
          {cityBranches.map((branch) => (
            <div key={branch.slug} className="sc-branch-item">
              <div
                className="sc-branch-header"
                onClick={() => setExpanded(expanded === branch.slug ? null : branch.slug)}
                role="button"
                tabIndex={0}
                aria-expanded={expanded === branch.slug}
                onKeyDown={(e) => e.key === 'Enter' && setExpanded(expanded === branch.slug ? null : branch.slug)}
              >
                <span className="sc-branch-name">{branch.name}</span>
                <span className={`sc-branch-toggle${expanded === branch.slug ? ' sc-branch-toggle--open' : ''}`}>+</span>
              </div>
              {expanded === branch.slug && (
                <div className="sc-branch-body">
                  {branch.address && (
                    <p className="sc-branch-addr">{branch.address}</p>
                  )}
                  <div className="sc-branch-actions">
                    {branch.phone && (
                      <a href={`tel:${branch.phone}`} className="sc-branch-action">Call Now</a>
                    )}
                    {branch.phone && (
                      <a
                        href={`https://wa.me/91${branch.phone}?text=${encodeURIComponent('Hi, I want to sell my gold. Can you help?')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="sc-branch-action"
                      >
                        WhatsApp
                      </a>
                    )}
                    <a href={`/sell-gold-${branch.slug}`} className="sc-branch-action">View Branch</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */

export default function SampleCPage() {
  const [slide, setSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { rate22K, isLoading } = useGoldRate();

  const startInterval = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setSlide(s => (s + 1) % SLIDES.length);
    }, 4000);
  }, []);

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startInterval]);

  function goToSlide(i: number) {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSlide(i);
    startInterval();
  }

  const current = SLIDES[slide];

  return (
    <>
      <style>{`
        /* ── Hero ─────────────────────────────────────────── */
        .sc-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .sc-hero__slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 0.8s ease;
        }
        .sc-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(59,24,72,0.92) 0%,
            rgba(81,37,97,0.80) 50%,
            rgba(59,24,72,0.92) 100%
          );
        }
        .sc-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }
        .sc-hero__content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 1.5rem 3rem;
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 900px) {
          .sc-hero__content { grid-template-columns: 1fr; gap: 2.5rem; }
        }
        .sc-hero__eyebrow {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-2xs);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sc-hero__eyebrow::before {
          content: '';
          display: inline-block;
          width: 32px;
          height: 2px;
          background: var(--gold);
          border-radius: 1px;
        }
        .sc-hero__h1-kn {
          font-family: 'Anek Kannada', sans-serif;
          font-size: clamp(1rem, 2.5vw, 1.375rem);
          font-weight: 600;
          color: rgba(223,193,96,0.75);
          margin-bottom: 0.5rem;
          line-height: 1.3;
          min-height: 1.8em;
          transition: opacity 0.5s ease;
        }
        .sc-hero__h1 {
          font-family: 'Tanker', serif;
          font-size: var(--t-display);
          color: #fff;
          line-height: 1.05;
          margin-bottom: 1.25rem;
          min-height: 3em;
          transition: opacity 0.5s ease;
        }
        .sc-hero__sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-lg);
          color: rgba(255,255,255,0.7);
          margin-bottom: 2rem;
          min-height: 2.5rem;
          transition: opacity 0.5s ease;
        }
        .sc-hero__cta-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
        .sc-hero__rate-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(223,193,96,0.1);
          border: 1px solid rgba(223,193,96,0.3);
          border-radius: 9999px;
          padding: 0.5rem 1rem;
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--gold);
        }
        .sc-hero__live-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          animation: livePulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }
        .sc-hero__seals {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-top: 2rem;
        }
        .sc-hero__dots {
          position: absolute;
          bottom: 1.75rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 0.5rem;
        }
        .sc-hero__dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(223,193,96,0.35);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: background var(--t-fast), transform var(--t-fast);
        }
        .sc-hero__dot--active {
          background: var(--gold);
          transform: scale(1.4);
        }
        .sc-hero__clip {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 56px), 0 100%);
        }
        @media (max-width: 768px) {
          .sc-hero__clip { clip-path: none; }
        }

        /* ── Rate + Chart section ──────────────────────────── */
        .sc-rate-section {
          background: var(--plum-deep);
          position: relative;
        }
        .sc-rate-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpolygon points='36,4 68,64 4,64' fill='none' stroke='%23512561' stroke-width='1.5' opacity='0.20'/%3E%3Cpolygon points='36,18 56,58 16,58' fill='%237B2C91' opacity='0.12'/%3E%3Cpolygon points='36,32 50,56 22,56' fill='none' stroke='%237B2C91' stroke-width='0.8' opacity='0.15'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 72px 72px;
          pointer-events: none;
        }
        .sc-rate-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .sc-rate-grid { grid-template-columns: 1fr; }
        }
        .sc-chart-card {
          background: rgba(59,24,72,0.6);
          border: 1px solid rgba(223,193,96,0.2);
          border-radius: 16px;
          padding: 1.75rem;
        }
        .sc-chart-title {
          font-family: 'Tanker', serif;
          font-size: var(--t-h3);
          color: #fff;
          margin-bottom: 0.5rem;
        }
        .sc-chart-sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--mist);
          margin-bottom: 1.25rem;
        }

        /* ── Calculator + Form section ────────────────────── */
        .sc-calc-section {
          background: var(--plum);
          position: relative;
        }
        .sc-calc-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Cpolygon points='36,4 68,64 4,64' fill='none' stroke='%237B2C91' stroke-width='1.5' opacity='0.20'/%3E%3Cpolygon points='36,18 56,58 16,58' fill='%237B2C91' opacity='0.10'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 72px 72px;
          pointer-events: none;
        }
        .sc-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          position: relative;
        }
        @media (max-width: 900px) {
          .sc-two-col { grid-template-columns: 1fr; }
        }
        .sc-card-dark {
          background: rgba(59,24,72,0.6);
          border: 1px solid rgba(223,193,96,0.2);
          border-radius: 16px;
          padding: 2rem;
        }
        .sc-card-title {
          font-family: 'Tanker', serif;
          font-size: var(--t-h3);
          color: var(--gold);
          margin-bottom: 0.5rem;
        }
        .sc-card-sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: rgba(255,255,255,0.6);
          margin-bottom: 1.5rem;
        }

        /* ── Testimonials ─────────────────────────────────── */
        .sc-reviews-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .sc-reviews-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .sc-reviews-grid { grid-template-columns: 1fr; }
        }
        .sc-review-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--gallery-dk);
          position: relative;
        }
        .sc-review-stars {
          display: flex;
          gap: 2px;
          margin-bottom: 0.875rem;
        }
        .sc-review-star {
          width: 14px; height: 14px;
          background: var(--gold);
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        .sc-review-text {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--ink-mid);
          line-height: 1.65;
          margin-bottom: 1.25rem;
        }
        .sc-review-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .sc-review-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: var(--plum);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Tanker', serif;
          font-size: 0.875rem;
          color: var(--gold);
          flex-shrink: 0;
        }
        .sc-review-name {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          font-size: var(--t-sm);
          color: var(--ink);
        }
        .sc-review-area {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: var(--mist);
        }
        .sc-google-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--plum);
          opacity: 0.5;
          text-transform: uppercase;
        }
      `}</style>

      <MkTicker />
      <MkNavbar />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="sc-hero mk-bg-dark" aria-label="Hero">
        {/* Slide background */}
        <div
          className="sc-hero__slide"
          style={{
            backgroundImage: `url('${current.bg}')`,
          }}
        />
        <div className="sc-hero__overlay" />
        <div className="sc-grain" />

        {/* Content */}
        <div className="sc-hero__content">
          <div>
            <p className="sc-hero__eyebrow">Karnataka&apos;s Trusted Gold Buyer Since 2014</p>
            <p className="sc-hero__h1-kn" key={`kn-${slide}`}>{current.headlineKn}</p>
            <h1 className="sc-hero__h1" key={`h1-${slide}`}>{current.headline}</h1>
            <p className="sc-hero__sub" key={`sub-${slide}`}>{current.sub}</p>

            <div className="sc-hero__cta-row">
              <MkButton variant="gold" size="lg" href="/sell-gold">Sell Gold Today</MkButton>
              <MkButton variant="outline-light" size="lg" href="/release-pledged-gold">
                Release Pledged Gold
              </MkButton>
            </div>

            <div className="sc-hero__rate-badge">
              <span className="sc-hero__live-dot" />
              <span>
                Live 22K Rate:{' '}
                <strong>
                  {isLoading ? '…' : `₹${rate22K.toLocaleString('en-IN')}/10g`}
                </strong>
              </span>
            </div>

            <div className="sc-hero__seals">
              <MkSeal variant="en" size="md" animate />
              <MkSeal variant="kn" size="md" />
            </div>
          </div>

          {/* Rate widget */}
          <div>
            <MkRateWidget variant="hero" />
          </div>
        </div>

        {/* Slide dots */}
        <div className="sc-hero__dots" role="tablist" aria-label="Hero slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`sc-hero__dot${slide === i ? ' sc-hero__dot--active' : ''}`}
              role="tab"
              aria-selected={slide === i}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Stats band ────────────────────────────────────────── */}
      <MkStatBand />

      {/* ── Rate + Chart ──────────────────────────────────────── */}
      <section className="sc-rate-section section" id="gold-rate">
        <div className="mk-container" style={{ position: 'relative' }}>
          <p className="mk-section-overline reveal">Live Gold Rate Karnataka</p>
          <h2
            className="reveal delay-1"
            style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: '#fff', marginBottom: '2.5rem' }}
          >
            Today&apos;s Rate + 12-Year Price History
          </h2>
          <div className="sc-rate-grid">
            <div className="reveal delay-2">
              <MkRateWidget variant="page" />
            </div>
            <div className="sc-chart-card reveal delay-3">
              <h3 className="sc-chart-title">Gold Price Trend (per 10g, INR)</h3>
              <p className="sc-chart-sub">22K gold MCX reference — Karnataka market</p>
              <GoldRateChart />
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator + Callback ─────────────────────────────── */}
      <section className="sc-calc-section section" id="calculator">
        <div className="mk-container" style={{ position: 'relative' }}>
          <p className="mk-section-overline reveal">Free Estimate</p>
          <h2
            className="reveal delay-1"
            style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: '#fff', marginBottom: '2.5rem' }}
          >
            How Much Is Your Gold Worth?
          </h2>
          <div className="sc-two-col">
            <div className="sc-card-dark reveal delay-2">
              <h3 className="sc-card-title">Gold Value Calculator</h3>
              <p className="sc-card-sub">Live MCX rates · Results in seconds · No sign-up needed</p>
              <MkCalculator variant="dark" showBookingCTA />
            </div>
            <div className="sc-card-dark reveal delay-3">
              <h3 className="sc-card-title">Request a Callback</h3>
              <p className="sc-card-sub">Our team will call you within 30 minutes · Confidential</p>
              <CallbackForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <MkSteps />

      {/* ── Trust architecture ────────────────────────────────── */}
      <MkTrust />

      {/* ── Branch finder ─────────────────────────────────────── */}
      <BranchFinder />

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="mk-bg-light section" id="reviews">
        <div className="mk-container">
          <p className="mk-section-overline reveal" style={{ color: 'var(--plum)' }}>
            Google Reviews
          </p>
          <h2
            className="reveal delay-1"
            style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: 'var(--ink)', marginBottom: '0.75rem' }}
          >
            4.9 Stars Across All Branches
          </h2>
          <p
            className="reveal delay-2"
            style={{
              fontFamily: 'Poppins,sans-serif',
              fontSize: 'var(--t-base)',
              color: 'var(--ink-mid)',
              marginBottom: '2.5rem',
              maxWidth: '540px',
            }}
          >
            Real reviews from real customers. We do not filter or curate — these are pulled live from Google.
          </p>
          <div className="sc-reviews-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className={`sc-review-card reveal delay-${(i % 3) + 1}`}>
                <span className="sc-google-badge">Google</span>
                <div className="sc-review-stars" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <div key={j} className="sc-review-star" />
                  ))}
                </div>
                <p className="sc-review-text">&ldquo;{t.text}&rdquo;</p>
                <div className="sc-review-author">
                  <div className="sc-review-avatar" aria-hidden="true">{t.initials}</div>
                  <div>
                    <p className="sc-review-name">{t.name}</p>
                    <p className="sc-review-area">{t.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <MkFaq />

      {/* ── CTA Band ──────────────────────────────────────────── */}
      <MkCtaBand />

      {/* ── Footer ────────────────────────────────────────────── */}
      <MkFooter />

      {/* ── Floating WhatsApp ─────────────────────────────────── */}
      <MkWhatsApp />
    </>
  );
}
