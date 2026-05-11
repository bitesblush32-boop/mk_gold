'use client';

import { useState, useEffect, useRef } from 'react';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkStatBand } from '@/components/sections/MkStatBand';
import { MkSteps } from '@/components/sections/MkSteps';
import { MkFaq } from '@/components/sections/MkFaq';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { MkWhatsApp } from '@/components/features/MkWhatsApp';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkCalculator } from '@/components/features/MkCalculator';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { BRANCHES } from '@/lib/branch-router';

/* ─── Hero slides ─────────────────────────────────────────────── */

const SLIDES = [
  {
    video: '/b1.mp4',
    headline: 'Sell Your Gold Today',
    headlineKn: 'ನಿಮ್ಮ ಚಿನ್ನವನ್ನು ಇಂದೇ ಮಾರಿ',
    sub: 'Live MCX rates · XRF purity test · Payment in 45 minutes',
  },
  {
    video: '/b2.mp4',
    headline: "Karnataka's Most Trusted Gold Buyer",
    headlineKn: 'ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ವಿಶ್ವಾಸಾರ್ಹ ಚಿನ್ನ ಖರೀದಿದಾರ',
    sub: '16 branches · 10,000+ customers · Est. 2014',
  },
  {
    video: '/b3.mp4',
    headline: 'Release Pledged Gold Confidentially',
    headlineKn: 'ಗೋಪ್ಯವಾಗಿ ಅಡಮಾನ ಚಿನ್ನ ಬಿಡಿಸಿ',
    sub: 'We pay your lender directly · Discreet · Same-day possible',
  },
  {
    video: '/b4.mp4',
    headline: 'Fair Value. Every Time.',
    headlineKn: 'ನ್ಯಾಯಯುತ ಮೌಲ್ಯ. ಪ್ರತಿ ಬಾರಿ.',
    sub: 'ISO 9001:2015 · German XRF Spectrometer · Transparent pricing',
  },
  {
    video: '/b5.mp4',
    headline: 'Instant Money, Lasting Trust',
    headlineKn: 'ತಕ್ಷಣ ಹಣ, ಶಾಶ್ವತ ವಿಶ್ವಾಸ',
    sub: 'Bangalore · Mysore · Mangalore · Davangere',
  },
];

/* ─── Chart data (12-year gold price history — illustrative) ───── */

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

/* ─── Testimonials ─────────────────────────────────────────────── */

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

/* ─── City branch data ─────────────────────────────────────────── */

const CITIES = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = typeof CITIES[number];

/* ─── SVG Area Chart ───────────────────────────────────────────── */

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
      {/* Header row: title left, filter pills right */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)', fontWeight: 600, color: 'rgba(255,255,255,0.80)' }}>
          Gold Rate Trend — 12 Years (INR per 10g)
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

        {yTickVals.map((v, i) => (
          <g key={i}>
            <line x1={PAD.left} y1={py(v)} x2={PAD.left + chartW} y2={py(v)} stroke="rgba(223,193,96,0.12)" strokeWidth="1" />
            <text x={PAD.left - 8} y={py(v) + 4} textAnchor="end"
              style={{ fontFamily: 'Poppins,sans-serif', fontSize: '10px', fill: 'rgba(223,193,96,0.55)' }}>
              {(v / 1000).toFixed(0)}K
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#sc-area-grad)" />
        <path d={linePath} fill="none" stroke="#DFC160" strokeWidth="2" strokeLinejoin="round" />

        {filtered.map((d, i) => {
          const skip = filtered.length > 8 ? i % 2 !== 0 : false;
          return !skip ? (
            <text key={d.year} x={px(i)} y={H - 6} textAnchor="middle"
              style={{ fontFamily: 'Poppins,sans-serif', fontSize: '10px', fill: 'rgba(223,193,96,0.55)' }}>
              {d.year}
            </text>
          ) : null;
        })}

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
                <rect x={px(i) - 44} y={py(d.price) - 38} width="88" height="28"
                  rx="6" fill="#3B1848" stroke="rgba(223,193,96,0.4)" strokeWidth="1" />
                <text x={px(i)} y={py(d.price) - 20} textAnchor="middle"
                  style={{ fontFamily: 'Poppins,sans-serif', fontSize: '11px', fontWeight: '600', fill: '#DFC160' }}>
                  ₹{d.price.toLocaleString('en-IN')}/10g
                </text>
                <text x={px(i)} y={py(d.price) - 8} textAnchor="middle"
                  style={{ fontFamily: 'Poppins,sans-serif', fontSize: '9px', fill: 'rgba(255,255,255,0.6)' }}>
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

/* ─── Callback form ────────────────────────────────────────────── */

function CallbackForm() {
  const [form, setForm] = useState({ name: '', phone: '', goldType: '', weight: '', city: '' });
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
        }}>MK</div>
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
          <input type="text" required className="mk-input mk-input--dark" placeholder="Full name"
            value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Phone Number</label>
          <input type="tel" required pattern="[6-9][0-9]{9}" className="mk-input mk-input--dark"
            placeholder="10-digit mobile" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Gold Type</label>
          <select className="mk-select mk-select--dark" value={form.goldType} onChange={set('goldType')}
            style={{ colorScheme: 'dark' }}>
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
          <input type="number" min="0.1" step="0.1" className="mk-input mk-input--dark"
            placeholder="e.g. 10" value={form.weight} onChange={set('weight')} />
        </div>
      </div>
      <div>
        <label className="mk-calc__label" style={{ color: 'rgba(223,193,96,0.8)' }}>Nearest City</label>
        <select className="mk-select mk-select--dark" value={form.city} onChange={set('city')}
          style={{ colorScheme: 'dark' }}>
          <option value="">Select city</option>
          <option value="bangalore">Bangalore</option>
          <option value="mysore">Mysore</option>
          <option value="mangalore">Mangalore</option>
          <option value="davangere">Davangere</option>
        </select>
      </div>
      <MkButton type="submit" variant="gold" size="lg"
        style={{ width: '100%', marginTop: '0.5rem' }}
        disabled={status === 'loading'}>
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

/* ─── Branch Finder ────────────────────────────────────────────── */

function BranchFinder() {
  const [activeCity, setActiveCity] = useState<City>('Bangalore');
  const [expanded, setExpanded] = useState<string | null>(null);

  const cityBranches = BRANCHES.filter(b =>
    b.city.toLowerCase() === activeCity.toLowerCase()
  );

  const cityArt: Record<City, React.ReactNode> = {
    Bangalore: (
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.3 }}>
        <rect x="8" y="78" width="104" height="4" rx="1" fill="#DFC160" opacity="0.4" />
        <rect x="48" y="18" width="24" height="60" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <rect x="48" y="14" width="24" height="6" rx="1" fill="#7B2C91" opacity="0.4" stroke="#DFC160" strokeWidth="1" />
        <rect x="52" y="25" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="60" y="25" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="68" y="25" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="52" y="35" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="60" y="35" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="68" y="35" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="52" y="45" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="60" y="45" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="68" y="45" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="52" y="55" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="60" y="55" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="68" y="55" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.2" />
        <rect x="22" y="34" width="18" height="44" fill="none" stroke="#DFC160" strokeWidth="1.2" />
        <rect x="26" y="38" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="34" y="38" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="26" y="48" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="34" y="48" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="80" y="30" width="20" height="48" fill="none" stroke="#DFC160" strokeWidth="1.2" />
        <rect x="83" y="36" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="91" y="36" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="83" y="46" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="91" y="46" width="4" height="5" rx="0.5" fill="#DFC160" opacity="0.15" />
        <rect x="8" y="50" width="12" height="28" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.7" />
        <rect x="102" y="42" width="10" height="36" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.7" />
        <line x1="60" y1="14" x2="60" y2="4" stroke="#DFC160" strokeWidth="1.5" />
        <circle cx="60" cy="4" r="2" fill="#DFC160" opacity="0.8" />
      </svg>
    ),
    Mysore: (
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.3 }}>
        <rect x="8" y="76" width="104" height="6" rx="1" fill="#DFC160" opacity="0.4" />
        <rect x="16" y="72" width="88" height="6" rx="1" fill="#DFC160" opacity="0.25" />
        <rect x="28" y="42" width="64" height="30" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <path d="M30,72 Q36,58 42,72" fill="#7B2C91" opacity="0.2" stroke="#DFC160" strokeWidth="1" />
        <path d="M43,72 Q49,58 55,72" fill="#7B2C91" opacity="0.2" stroke="#DFC160" strokeWidth="1" />
        <path d="M56,72 Q62,58 68,72" fill="#7B2C91" opacity="0.2" stroke="#DFC160" strokeWidth="1" />
        <path d="M69,72 Q75,58 81,72" fill="#7B2C91" opacity="0.2" stroke="#DFC160" strokeWidth="1" />
        <path d="M48,42 Q60,22 72,42" fill="#7B2C91" opacity="0.35" stroke="#DFC160" strokeWidth="1.5" />
        <ellipse cx="60" cy="22" rx="6" ry="8" fill="#7B2C91" opacity="0.3" stroke="#DFC160" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="60" y2="6" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="57,6 60,0 63,6" fill="#DFC160" opacity="0.85" />
        <rect x="22" y="30" width="8" height="42" fill="none" stroke="#DFC160" strokeWidth="1.2" opacity="0.8" />
        <path d="M22,30 Q26,22 30,30" fill="#7B2C91" opacity="0.3" stroke="#DFC160" strokeWidth="1" />
        <line x1="26" y1="22" x2="26" y2="16" stroke="#DFC160" strokeWidth="1.2" />
        <circle cx="26" cy="15" r="2" fill="#DFC160" opacity="0.7" />
        <rect x="90" y="30" width="8" height="42" fill="none" stroke="#DFC160" strokeWidth="1.2" opacity="0.8" />
        <path d="M90,30 Q94,22 98,30" fill="#7B2C91" opacity="0.3" stroke="#DFC160" strokeWidth="1" />
        <line x1="94" y1="22" x2="94" y2="16" stroke="#DFC160" strokeWidth="1.2" />
        <circle cx="94" cy="15" r="2" fill="#DFC160" opacity="0.7" />
        <line x1="28" y1="52" x2="92" y2="52" stroke="#DFC160" strokeWidth="0.8" opacity="0.4" />
        <line x1="28" y1="60" x2="92" y2="60" stroke="#DFC160" strokeWidth="0.8" opacity="0.3" />
      </svg>
    ),
    Mangalore: (
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.3 }}>
        <rect x="10" y="75" width="100" height="6" rx="2" fill="#DFC160" opacity="0.5" />
        <rect x="18" y="42" width="24" height="33" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="18,42 30,18 42,42" fill="#7B2C91" opacity="0.35" stroke="#DFC160" strokeWidth="1.2" />
        <line x1="30" y1="18" x2="30" y2="10" stroke="#DFC160" strokeWidth="1.5" />
        <circle cx="30" cy="9" r="2.5" fill="#DFC160" opacity="0.7" />
        <rect x="24" y="52" width="6" height="8" rx="3" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <rect x="24" y="64" width="6" height="6" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <rect x="48" y="50" width="24" height="25" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <path d="M48,50 Q60,36 72,50" fill="#7B2C91" opacity="0.3" stroke="#DFC160" strokeWidth="1.2" />
        <rect x="54" y="58" width="12" height="17" rx="1" fill="#DFC160" opacity="0.12" />
        <rect x="78" y="42" width="24" height="33" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="78,42 90,18 102,42" fill="#7B2C91" opacity="0.35" stroke="#DFC160" strokeWidth="1.2" />
        <line x1="90" y1="18" x2="90" y2="10" stroke="#DFC160" strokeWidth="1.5" />
        <circle cx="90" cy="9" r="2.5" fill="#DFC160" opacity="0.7" />
        <rect x="84" y="52" width="6" height="8" rx="3" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <rect x="84" y="64" width="6" height="6" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <line x1="18" y1="48" x2="42" y2="48" stroke="#DFC160" strokeWidth="0.8" opacity="0.5" />
        <line x1="78" y1="48" x2="102" y2="48" stroke="#DFC160" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
    Davangere: (
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.3 }}>
        <rect x="10" y="78" width="100" height="5" rx="2" fill="#DFC160" opacity="0.45" />
        <rect x="46" y="28" width="28" height="50" fill="none" stroke="#DFC160" strokeWidth="1.5" />
        <path d="M46,28 Q60,8 74,28" fill="#7B2C91" opacity="0.35" stroke="#DFC160" strokeWidth="1.5" />
        <line x1="60" y1="8" x2="60" y2="0" stroke="#DFC160" strokeWidth="1.5" />
        <polygon points="56,0 60,-6 64,0" fill="#DFC160" opacity="0.8" />
        <rect x="52" y="34" width="8" height="10" rx="4" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <rect x="64" y="34" width="8" height="10" rx="4" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.6" />
        <rect x="52" y="50" width="8" height="10" rx="1" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.5" />
        <rect x="64" y="50" width="8" height="10" rx="1" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.5" />
        <rect x="26" y="52" width="20" height="26" fill="none" stroke="#DFC160" strokeWidth="1.2" opacity="0.7" />
        <rect x="74" y="52" width="20" height="26" fill="none" stroke="#DFC160" strokeWidth="1.2" opacity="0.7" />
        <path d="M26,52 Q36,42 46,52" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.5" />
        <path d="M74,52 Q84,42 94,52" fill="none" stroke="#DFC160" strokeWidth="1" opacity="0.5" />
        <line x1="26" y1="60" x2="94" y2="60" stroke="#DFC160" strokeWidth="0.8" opacity="0.35" />
        <circle cx="36" cy="52" r="2" fill="#DFC160" opacity="0.5" />
        <circle cx="84" cy="52" r="2" fill="#DFC160" opacity="0.5" />
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
        .sc-city-card--active { border-color: var(--gold); background: rgba(223,193,96,0.08); }
        .sc-city-name { font-family: 'Tanker', serif; font-size: var(--t-h4); color: var(--gold); margin: 0.5rem 0 0.25rem; }
        .sc-city-count { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); color: var(--mist); }
        .sc-branch-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .sc-branch-item { border: 1px solid rgba(223,193,96,0.15); border-radius: 10px; overflow: hidden; transition: border-color var(--t-fast); }
        .sc-branch-item:hover { border-color: rgba(223,193,96,0.35); }
        .sc-branch-header { display: flex; justify-content: space-between; align-items: center; padding: 0.875rem 1rem; cursor: pointer; background: rgba(81,37,97,0.2); }
        .sc-branch-name { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: var(--t-base); color: #fff; }
        .sc-branch-toggle { font-family: 'Tanker', serif; font-size: 1.25rem; color: var(--gold); line-height: 1; transform-origin: center; transition: transform var(--t-fast); display: inline-block; }
        .sc-branch-toggle--open { transform: rotate(45deg); }
        .sc-branch-body { padding: 0 1rem 1rem; background: rgba(59,24,72,0.3); display: flex; flex-direction: column; gap: 0.5rem; }
        .sc-branch-addr { font-family: 'Poppins', sans-serif; font-size: var(--t-sm); color: var(--mist); line-height: 1.5; }
        .sc-branch-actions { display: flex; gap: 0.75rem; margin-top: 0.25rem; flex-wrap: wrap; }
        .sc-branch-action { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); font-weight: 600; color: var(--gold); text-decoration: none; border: 1px solid rgba(223,193,96,0.35); padding: 0.3rem 0.875rem; border-radius: 9999px; transition: background var(--t-fast), color var(--t-fast); }
        .sc-branch-action:hover { background: var(--gold); color: var(--plum); }
      `}</style>

      <div className="mk-container">
        <p className="mk-section-overline reveal">16 Branches Across Karnataka</p>
        <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h2)', color: '#fff', marginBottom: '2.5rem' }}>
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
                  {branch.address && <p className="sc-branch-addr">{branch.address}</p>}
                  <div className="sc-branch-actions">
                    {branch.phone && <a href={`tel:${branch.phone}`} className="sc-branch-action">Call Now</a>}
                    {branch.phone && (
                      <a href={`https://wa.me/91${branch.phone}?text=${encodeURIComponent('Hi, I want to sell my gold. Can you help?')}`}
                        target="_blank" rel="noopener noreferrer" className="sc-branch-action">WhatsApp</a>
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

/* ─── Trust section data (mirrors MkTrust) ─────────────────────── */

const TRUST_PILLARS = [
  { label: 'ISO 9001:2015 Certified', detail: 'Quality management certified. Every process — weighing, testing, payment — is audited and documented.' },
  { label: 'German XRF Spectrometer', detail: 'We use a Bruker S1 Titan XRF spectrometer. It reads exact gold content. No acid. No guesswork.' },
  { label: 'Live MCX Rate Transparency', detail: 'Our buying rate is displayed beside the MCX rate so you can see exactly what we earn. Nothing hidden.' },
  { label: 'Est. 2014 — 11 Years', detail: '10,000+ transactions across Karnataka. A business built on repeat customers and word-of-mouth alone.' },
  { label: 'Confidential Service', detail: 'Private consultation rooms. Discreet transactions. Your decision to sell gold is yours — we never judge.' },
  { label: 'Post-Sale Support', detail: 'WhatsApp support after your transaction. Grievance email in footer. We stand behind every offer we make.' },
] as const;

const TRUST_BADGES = ['GST Registered', 'ISO 9001:2015', 'XRF Certified', '16 Physical Branches'] as const;

/* ─── Flippable trust coins ────────────────────────────────────── */

function FlippableTrustSeals({
  flip1, setFlip1,
}: {
  flip1: boolean; setFlip1: (v: (p: boolean) => boolean) => void;
}) {
  const coinStyle = { width: '130px', height: '130px', perspective: '600px', cursor: 'pointer', position: 'relative' as const };
  const innerStyle = (flipped: boolean) => ({
    width: '100%', height: '100%', position: 'relative' as const,
    transformStyle: 'preserve-3d' as const,
    transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    willChange: 'transform' as const,
  });
  const faceStyle: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden' };
  const backStyle: React.CSSProperties = { ...faceStyle, transform: 'rotateY(180deg)' };

  return (
    <div className="mk-trust__seals reveal">
      {/* Single coin — EN front / KN back */}
      <div
        style={coinStyle}
        onClick={() => setFlip1(f => !f)}
        role="button" tabIndex={0}
        aria-label={flip1 ? 'Showing Kannada — tap for English' : 'Showing English — tap for Kannada'}
        onKeyDown={(e) => e.key === 'Enter' && setFlip1(f => !f)}
      >
        <div style={innerStyle(flip1)}>
          <div style={faceStyle}><MkSeal variant="en" size="lg" animate={!flip1} /></div>
          <div style={backStyle}><MkSeal variant="kn" size="lg" /></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Local trust section with flippable coins ──────────────────── */

function LocalTrustSection({
  flip1, setFlip1,
}: {
  flip1: boolean; setFlip1: (v: (p: boolean) => boolean) => void;
}) {
  return (
    <section className="mk-trust mk-bg-dark section" id="why-mk-gold">
      <div className="mk-container mk-trust__inner">
        <div className="mk-trust__left">
          <FlippableTrustSeals flip1={flip1} setFlip1={setFlip1} />
          <div className="reveal delay-1">
            <p className="mk-section-overline">Why MK Gold</p>
            <h2 className="mk-trust__headline">
              Trust is built in <span className="mk-trust__accent">every detail.</span>
            </h2>
            <p className="mk-trust__intro">
              We have spent 11 years earning the trust of Karnataka&apos;s gold sellers —
              not through advertising, but through transparent process, fair rates,
              and respectful service.
            </p>
          </div>
          <div className="mk-trust__badges reveal delay-2" aria-label="Certifications">
            {TRUST_BADGES.map((b) => <span key={b} className="mk-trust__badge">{b}</span>)}
          </div>
        </div>
        <ul className="mk-trust__pillars" aria-label="Trust pillars">
          {TRUST_PILLARS.map((p, i) => (
            <li key={p.label} className={`mk-trust__pillar reveal delay-${(i % 3) + 1}`}>
              <strong className="mk-trust__pillar-label">{p.label}</strong>
              <p className="mk-trust__pillar-detail">{p.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */

export default function SampleCPage() {
  const [scrollPct, setScrollPct] = useState(0);
  const [sealFlipped, setSealFlipped] = useState(false);
  const [trustFlip1, setTrustFlip1] = useState(false);
  const [slide, setSlide] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === slide) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [slide]);

  function goToSlide(i: number) {
    setSlide(i);
  }

  const current = SLIDES[slide];

  return (
    <>
      <style>{`
        /* ── Chrome overrides ─────────────────────────────── */
        :root {
          --navbar-h: 90px;
          --chrome-h: 126px;
        }

        /* ── Navbar: glassmorphism panel ──────────────────── */
        .mk-navbar {
          height: 90px !important;
          background: rgba(40, 12, 56, 0.88) !important;
          backdrop-filter: blur(32px) saturate(1.4) !important;
          -webkit-backdrop-filter: blur(32px) saturate(1.4) !important;
          border-bottom: 1px solid rgba(223, 193, 96, 0.18) !important;
        }
        .mk-navbar__inner {
          background: rgba(59, 24, 72, 0.3) !important;
          border-radius: 14px !important;
          border: 1px solid rgba(223, 193, 96, 0.14) !important;
          margin: 10px 24px !important;
          padding: 0 1.5rem !important;
          height: 70px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.06) !important;
          max-width: unset !important;
        }
        .mk-navbar__logo-img {
          height: 70px !important;
        }
        .mk-navbar__link {
          font-size: 0.9375rem !important;
          padding: 0.375rem 0.875rem !important;
        }
        .mk-navbar__actions .mk-btn {
          font-size: 0.9rem !important;
          padding: 0.6rem 1.5rem !important;
        }
        .mk-ticker { top: 0 !important; }

        /* ── Hero ─────────────────────────────────────────── */
        .sc-hero {
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        .sc-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(59,24,72,0.95) 0%,
            rgba(81,37,97,0.82) 50%,
            rgba(59,24,72,0.95) 100%
          );
        }
        .sc-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }
        .sc-hero__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease;
          pointer-events: none;
        }
        .sc-hero__video--active {
          opacity: 1;
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

        .sc-hero__content {
          position: relative;
          z-index: 2;
          max-width: 1100px;
          margin: 0 auto;
          padding: 5rem 1.5rem 3rem;
          display: grid;
          grid-template-columns: 1fr;
        }
        .sc-hero__copy { max-width: 680px; }
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
        }
        .sc-hero__h1 {
          font-family: 'Tanker', serif;
          font-size: var(--t-display);
          color: #fff;
          line-height: 1.05;
          margin-bottom: 1.25rem;
        }
        .sc-hero__sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-lg);
          color: rgba(255,255,255,0.7);
          margin-bottom: 2rem;
          max-width: 560px;
          line-height: 1.65;
        }
        .sc-hero__cta-row { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1.5rem; }

        /* ── Rate + Chart section ──────────────────────────── */
        .sc-rate-section { position: relative; }

        .sc-rate-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
          margin-bottom: 2.5rem;
        }
        @media (max-width: 900px) {
          .sc-rate-top-grid { grid-template-columns: 1fr; }
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
        .sc-rate-divider {
          height: 1px;
          background: rgba(223,193,96,0.2);
          margin: 1.5rem 0;
        }

        /* ── Reviews carousel ─────────────────────────────── */
        .sc-reviews-track {
          display: flex;
          gap: 1.25rem;
          animation: reviewsScroll 32s linear infinite;
          width: max-content;
          will-change: transform;
        }
        .sc-reviews-track:hover { animation-play-state: paused; }
        .sc-review-card--carousel {
          width: 340px;
          flex-shrink: 0;
        }
        @keyframes reviewsScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * (340px * 6 + 1.25rem * 6))); }
        }
        @media (max-width: 640px) {
          .sc-review-card--carousel { width: 280px; }
        }

        /* ── Review card ──────────────────────────────────── */
        .sc-review-card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          border: 1px solid var(--gallery-dk);
          position: relative;
        }
        .sc-review-stars { display: flex; gap: 2px; margin-bottom: 0.875rem; }
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
        .sc-review-author { display: flex; align-items: center; gap: 0.75rem; }
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
        .sc-review-name { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: var(--t-sm); color: var(--ink); }
        .sc-review-area { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); color: var(--mist); }
        .sc-google-badge {
          position: absolute;
          top: 1rem; right: 1rem;
          font-family: 'Poppins', sans-serif;
          font-size: 0.6rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          color: var(--plum);
          opacity: 0.5;
          text-transform: uppercase;
        }

        /* ── WhatsApp FAB override ────────────────────────── */
        [aria-label="Chat on WhatsApp"] {
          position: fixed !important;
          bottom: 1.5rem !important;
          right: 1.5rem !important;
          z-index: 400 !important;
          width: 56px !important;
          height: 56px !important;
          border-radius: 50% !important;
          background: #25D366 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 20px rgba(37,211,102,0.4), 0 2px 8px rgba(0,0,0,0.3) !important;
          text-decoration: none !important;
          transition: transform 260ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 260ms ease !important;
          color: white !important;
          font-family: 'Tanker', serif !important;
          font-size: 1.1rem !important;
          letter-spacing: 0.02em !important;
        }
        [aria-label="Chat on WhatsApp"]:hover {
          transform: scale(1.12) !important;
          box-shadow: 0 6px 28px rgba(37,211,102,0.55), 0 4px 12px rgba(0,0,0,0.3) !important;
        }

        /* ── Select dropdown options ──────────────────────── */
        .mk-select--dark option {
          background-color: #2d0a42 !important;
          color: rgba(255,255,255,0.90) !important;
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.875rem !important;
        }
        .mk-select--dark option:checked {
          background-color: #512561 !important;
          color: #DFC160 !important;
        }
        .sc-card-dark select option,
        .sc-card-dark .mk-select option {
          background-color: #2d0a42 !important;
          color: rgba(255,255,255,0.90) !important;
        }

        /* ── Continuous bg wrappers ───────────────────────── */
        /* Child sections become transparent so wrapper bg tiles continuously */
        .sc-no-gap > .mk-stat-band,
        .sc-no-gap > .mk-footer {
          background-color: transparent !important;
          background-image: none !important;
        }

        /* ── CTA band — graff-5 photo bg ──────────────────── */
        .sc-no-gap > .mk-cta-band {
          background-color: #3B1848 !important;
          background-image: url(/graff-3.jpg) !important;
          background-size: cover !important;
          background-position: center !important;
        }

        /* ── Hero coin — 70/30 overlap, static 3D ─────────── */
        /* Allow coin to bleed below hero — bg elements are all inset-0 so safe */
        .sc-hero { overflow: visible !important; z-index: 2; }
        .sc-no-gap { position: relative; z-index: 1; }

        /* Give StatBand breathing room so its text clears the coin */
        .sc-no-gap > .mk-stat-band { padding-top: 5rem !important; }

        /* Anchor: absolute at hero bottom, 30% (66px of 220px) below the edge */
        .sc-coin-anchor {
          position: absolute;
          bottom: -66px;
          left: 6%;
          z-index: 20;
          width: 220px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          pointer-events: auto;
        }

        /* Override MkSeal's inline 120px width/height so coin renders at 220px */
        .sc-coin-anchor img {
          width: 100% !important;
          height: 100% !important;
          object-fit: contain !important;
        }

        /* Static 3D depth — rich drop-shadow, no animation */
        .sc-coin-wobble {
          filter: drop-shadow(0 22px 40px rgba(0,0,0,.55))
                  drop-shadow(0 0 22px rgba(223,193,96,.35));
        }

        /* Hint label under the coin */
        .sc-coin-hint {
          font-family: 'Poppins', sans-serif;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.10em;
          text-transform: uppercase;
          color: rgba(223,193,96,0.55);
          white-space: nowrap;
          user-select: none;
        }
        @media (max-width: 480px) { .sc-coin-hint { display: none; } }
      `}</style>

      {/* ── Scroll progress bar ─────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          zIndex: 999,
          background: 'rgba(40,12,56,0.85)',
        }}
      >
        <div style={{
          height: '100%',
          width: `${scrollPct}%`,
          background: 'linear-gradient(90deg, #512561 0%, #7B2C91 40%, #DFC160 80%, #EDD47A 100%)',
          boxShadow: '0 1px 8px rgba(223,193,96,0.55), 0 2px 4px rgba(123,44,145,0.4)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 80ms linear',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            right: 0,
            top: '-3px',
            width: '16px',
            height: '10px',
            background: 'radial-gradient(ellipse at right, rgba(223,193,96,0.9) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(2px)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      <MkTicker />
      <MkNavbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="sc-hero mk-bg-dark" aria-label="Hero">
        {SLIDES.map((s, i) => (
          <video
            key={s.video}
            ref={el => { videoRefs.current[i] = el; }}
            src={s.video}
            className={`sc-hero__video${i === slide ? ' sc-hero__video--active' : ''}`}
            muted
            playsInline
            preload="auto"
            onEnded={() => setSlide(p => (p + 1) % SLIDES.length)}
            aria-hidden="true"
          />
        ))}
        <div className="sc-hero__overlay" />
        <div className="sc-grain" />

        <div className="sc-hero__content">
          <div className="sc-hero__copy">
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

          </div>
        </div>

        {/* ── Overlapping coin anchor — 70% hero / 30% below ── */}
        <div className="sc-coin-anchor">
          {/* Outer: constant 3D wobble + gold glow */}
          <div className="sc-coin-wobble">
            {/* Perspective wrapper */}
            <div
              onClick={() => setSealFlipped(f => !f)}
              role="button"
              tabIndex={0}
              aria-label={sealFlipped ? 'Showing Kannada — tap for English' : 'Showing English — tap for Kannada'}
              onKeyDown={(e) => e.key === 'Enter' && setSealFlipped(f => !f)}
              style={{ width: '220px', height: '220px', perspective: '700px', cursor: 'pointer', position: 'relative' }}
            >
              {/* Inner: EN ↔ KN flip */}
              <div style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: sealFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                willChange: 'transform',
              }}>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="en" size="lg" animate={!sealFlipped} />
                </div>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="kn" size="lg" />
                </div>
              </div>
            </div>
          </div>
          <span className="sc-coin-hint">
            {sealFlipped ? 'MK ಅಂದರೆ ನಂಬಿಕೆ' : 'Tap to flip'}
          </span>
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

      {/* ── Stats band + Rate section — continuous dark bg ─────── */}
      <div className="mk-bg-dark sc-no-gap">
        <MkStatBand />

        {/* ── Rate + Calculator + Callback + Chart ────────────────── */}
        <section className="sc-rate-section section" id="gold-rate">
          <div className="mk-container" style={{ position: 'relative' }}>
            <p className="mk-section-overline reveal">Live Gold Rate Karnataka</p>
            <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: '#fff', marginBottom: '2.5rem' }}>
              Today&apos;s Rate, Calculator &amp; Callback
            </h2>

            {/* Top row: Rate+Calc | Callback */}
            <div className="sc-rate-top-grid">
              {/* Left: Rate widget + divider + calculator */}
              <div className="sc-chart-card reveal delay-2">
                <MkRateWidget variant="page" />
                <div className="sc-rate-divider" />
                <MkCalculator variant="dark" showBookingCTA={false} />
              </div>

              {/* Right: Callback form */}
              <div className="sc-card-dark reveal delay-3">
                <h3 className="sc-card-title">Request a Callback</h3>
                <p className="sc-card-sub">Our team will call you within 30 minutes · Confidential</p>
                <CallbackForm />
              </div>
            </div>

            {/* Bottom row: Full-width chart */}
            <div className="sc-chart-card reveal delay-2" style={{ marginTop: 0 }}>
              <GoldRateChart />
            </div>
          </div>
        </section>
      </div>{/* end continuous dark: StatBand + Rate */}

      {/* ── How it works ────────────────────────────────────────── */}
      <MkSteps />

      {/* ── Trust architecture ──────────────────────────────────── */}
      <LocalTrustSection flip1={trustFlip1} setFlip1={setTrustFlip1} />

      {/* ── Branch finder ───────────────────────────────────────── */}
      <BranchFinder />

      {/* ── Testimonials: infinite scroll carousel ──────────────── */}
      <section
        className="section"
        id="reviews"
        style={{ backgroundImage: 'url(/graff-2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="mk-container">
          <p className="mk-section-overline reveal" style={{ color: 'var(--plum)' }}>Google Reviews</p>
          <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: 'var(--ink)', marginBottom: '0.75rem' }}>
            4.9 Stars Across All Branches
          </h2>
          <p className="reveal delay-2" style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', marginBottom: '2.5rem', maxWidth: '540px' }}>
            Real reviews from real customers — pulled live from Google.
          </p>
        </div>

        {/* Carousel — full bleed, no container constraint */}
        <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
          <div className="sc-reviews-track">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div key={i} className="sc-review-card sc-review-card--carousel">
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

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <MkFaq />

      {/* ── CTA Band + Footer — continuous dark bg ──────────────── */}
      <div className="mk-bg-dark sc-no-gap">
        <MkCtaBand />
        <MkFooter />
      </div>

      {/* ── Floating WhatsApp ───────────────────────────────────── */}
      <MkWhatsApp number="918000000001" message="Hi, I want to sell my gold. Can you help?" />
    </>
  );
}
