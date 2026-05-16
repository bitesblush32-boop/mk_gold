'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkFaq } from '@/components/sections/MkFaq';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { MkRateWidget } from '@/components/features/MkRateWidget';
import { MkCalculator } from '@/components/features/MkCalculator';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { MkLeadPopup } from '@/components/features/MkLeadPopup';
import { MkEmergency } from '@/components/features/MkEmergency';
import { BRANCHES, type Branch } from '@/lib/branch-router';
import { FALLBACK_BANNERS } from '@/lib/data/home';
import { getUtmParams } from '@/lib/utm';
import type { FaqItem } from '@/lib/db/faqs';

const CITIES = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = typeof CITIES[number];

/* ─── City SVG map definitions ─────────────────────────────────── */

interface CityMapDef {
  bbox: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  vw: number; vh: number;
  roads: { d: string; type: 'highway' | 'major' | 'minor' }[];
  landmarks: { x: number; y: number; label: string }[];
}

const CITY_MAPS: Record<City, CityMapDef> = {
  Bangalore: {
    bbox: { minLat: 12.88, maxLat: 13.05, minLng: 77.49, maxLng: 77.78 },
    vw: 500, vh: 320,
    roads: [
      { d: 'M 140,20 C 250,6 420,58 448,148 C 468,228 408,304 278,318 C 178,328 55,298 25,228 C 0,168 20,72 82,42 C 106,28 124,20 140,20 Z', type: 'highway' },
      { d: 'M 100,130 L 40,18', type: 'major' },
      { d: 'M 138,128 L 128,0', type: 'major' },
      { d: 'M 0,148 L 500,148', type: 'major' },
      { d: 'M 220,148 L 248,320', type: 'major' },
      { d: 'M 178,215 L 178,320', type: 'major' },
      { d: 'M 200,130 L 500,55', type: 'major' },
      { d: 'M 138,148 L 0,268', type: 'major' },
      { d: 'M 100,80 L 100,230', type: 'minor' },
      { d: 'M 265,220 L 390,310', type: 'minor' },
      { d: 'M 262,95 L 262,220', type: 'minor' },
      { d: 'M 390,135 L 500,135', type: 'minor' },
    ],
    landmarks: [
      { x: 145, y: 154, label: 'Majestic' },
      { x: 265, y: 142, label: 'Indiranagar' },
      { x: 463, y: 160, label: 'Whitefield' },
    ],
  },
  Mysore: {
    bbox: { minLat: 12.27, maxLat: 12.37, minLng: 76.59, maxLng: 76.67 },
    vw: 400, vh: 340,
    roads: [
      { d: 'M 152,58 C 248,28 358,80 374,178 C 388,260 322,322 224,334 C 138,342 46,298 26,220 C 8,152 38,76 92,52 C 116,44 136,54 152,58 Z', type: 'highway' },
      { d: 'M 248,28 L 248,340', type: 'major' },
      { d: 'M 20,228 L 395,228', type: 'major' },
      { d: 'M 248,228 L 26,154', type: 'major' },
      { d: 'M 248,228 L 400,175', type: 'major' },
      { d: 'M 166,165 L 248,228', type: 'minor' },
      { d: 'M 108,102 L 248,228', type: 'minor' },
    ],
    landmarks: [
      { x: 258, y: 245, label: 'Palace' },
      { x: 175, y: 178, label: 'Gokulam' },
    ],
  },
  Mangalore: {
    bbox: { minLat: 12.84, maxLat: 12.91, minLng: 74.81, maxLng: 74.88 },
    vw: 400, vh: 340,
    roads: [
      { d: 'M 194,20 L 194,320', type: 'highway' },
      { d: 'M 20,200 L 380,200', type: 'major' },
      { d: 'M 20,220 L 380,220', type: 'major' },
      { d: 'M 194,130 L 320,60', type: 'major' },
      { d: 'M 210,100 L 395,38', type: 'minor' },
      { d: 'M 60,182 L 380,182', type: 'minor' },
      { d: 'M 100,140 L 300,140', type: 'minor' },
    ],
    landmarks: [
      { x: 200, y: 210, label: 'Hampankatta' },
      { x: 208, y: 128, label: 'Kadri' },
    ],
  },
  Davangere: {
    bbox: { minLat: 14.44, maxLat: 14.50, minLng: 75.89, maxLng: 75.96 },
    vw: 400, vh: 300,
    roads: [
      { d: 'M 0,182 L 400,182', type: 'highway' },
      { d: 'M 182,20 L 182,300', type: 'major' },
      { d: 'M 0,142 L 400,142', type: 'major' },
      { d: 'M 182,150 L 390,58', type: 'minor' },
      { d: 'M 182,195 L 95,300', type: 'minor' },
      { d: 'M 95,160 L 295,160', type: 'minor' },
    ],
    landmarks: [
      { x: 195, y: 175, label: 'PJ Extension' },
    ],
  },
};


/* ─── Callback form ────────────────────────────────────────────── */

function CallbackForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', goldType: '', weight: '', purity: '', city: '' });
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
        body: JSON.stringify({ ...form, source: 'sample-c-callback', ...getUtmParams() }),
      });
      if (res.ok) { setStatus('success'); if (onSuccess) onSuccess(); }
      else setStatus('error');
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
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      <div>
        <label className="mk-calc__label">Your Name</label>
        <input type="text" required className="mk-input" placeholder="Full name"
          value={form.name} onChange={set('name')} />
      </div>
      <div>
        <label className="mk-calc__label">Phone Number</label>
        <input type="tel" required pattern="[6-9][0-9]{9}" className="mk-input"
          placeholder="10-digit mobile" value={form.phone} onChange={set('phone')} />
      </div>
      <div>
        <label className="mk-calc__label">Gold Type</label>
        <select className="mk-select" value={form.goldType} onChange={set('goldType')}>
          <option value="">Select type</option>
          <option value="jewellery">Jewellery</option>
          <option value="coins">Gold Coins</option>
          <option value="bars">Gold Bars</option>
          <option value="broken">Broken / Scrap</option>
          <option value="pledged">Pledged Gold</option>
        </select>
      </div>
      <div>
        <label className="mk-calc__label">Gold Purity</label>
        <select className="mk-select" value={form.purity} onChange={set('purity')}>
          <option value="">Select purity</option>
          <option value="24k">24K (Pure / Coins)</option>
          <option value="22k">22K (Most common)</option>
          <option value="unknown">Not sure (we test free)</option>
        </select>
      </div>
      <div>
        <label className="mk-calc__label">Approx. Weight (g)</label>
        <input type="number" min="0.1" step="0.1" className="mk-input"
          placeholder="e.g. 10" value={form.weight} onChange={set('weight')} />
      </div>
      <div>
        <label className="mk-calc__label">Nearest City</label>
        <select className="mk-select" value={form.city} onChange={set('city')}>
          <option value="">Select city</option>
          <option value="bangalore">Bangalore</option>
          <option value="mysore">Mysore</option>
          <option value="mangalore">Mangalore</option>
          <option value="davangere">Davangere</option>
        </select>
      </div>
      <MkButton type="submit" variant="gold" size="lg"
        style={{ width: '100%', marginTop: '0.25rem' }}
        disabled={status === 'loading'}>
        {status === 'loading' ? 'Submitting…' : 'Unlock Calculator'}
      </MkButton>
      {status === 'error' && (
        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', color: '#f87171', textAlign: 'center' }}>
          Something went wrong. Please WhatsApp us directly.
        </p>
      )}
    </form>
  );
}

/* ─── Google Maps — SDK loader (runs once per page) ─────────────── */

let _mapsReady: Promise<void> | null = null;

function loadMapsSDK(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  if (_mapsReady) return _mapsReady;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;

  // If already loaded (e.g. HMR or second mount), resolve immediately
  if (win.google?.maps?.Map) { _mapsReady = Promise.resolve(); return _mapsReady; }

  // Classic loading (no loading=async): all requested libraries are fully
  // populated on google.maps.* by the time onload fires — no importLibrary needed.
  _mapsReady = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://maps.googleapis.com/maps/api/js?key=' +
      (process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? '') + '&libraries=marker';
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => { _mapsReady = null; reject(new Error('Maps SDK failed to load')); };
    document.head.appendChild(s);
  });
  return _mapsReady;
}

/* ─── Map style — Gallery light + gold highways + plum labels ────── */

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#f0efef' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#3d2250' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f4f4' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#dddcdc' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#c8c7c7' }] },
  { featureType: 'road.arterial', elementType: 'geometry.fill', stylers: [{ color: '#e4e3e3' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#e8d98a' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#c9a940' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfb0d0' }] },
  { featureType: 'water', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#e8e6e6' }] },
];

/* ─── City centre + zoom per city ───────────────────────────────── */

const CITY_CENTERS: Record<City, { lat: number; lng: number; zoom: number }> = {
  Bangalore: { lat: 12.9400, lng: 77.6100, zoom: 12 },
  Mysore: { lat: 12.3100, lng: 76.6400, zoom: 13 },
  Mangalore: { lat: 12.8765, lng: 74.8444, zoom: 14 },
  Davangere: { lat: 14.4644, lng: 75.9218, zoom: 14 },
};

/* ─── Branch marker pin factory (AdvancedMarkerElement) ─────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makePinElement(g: any, isActive: boolean): any {
  return new g.marker.PinElement({
    background: isActive ? '#DFC160' : '#512561',
    borderColor: isActive ? '#C9A940' : '#ffffff',
    glyphColor: isActive ? '#512561' : '#DFC160',
    scale: isActive ? 1.3 : 1.0,
  });
}

/* ─── Google Maps city panel ────────────────────────────────────── */

function GoogleCityMap({ city, activeBranch, setActiveBranch }: {
  city: City;
  activeBranch: Branch | null;
  setActiveBranch: (b: Branch | null) => void;
}) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<{ branch: Branch; marker: any }[]>([]);
  const activeBranchRef = useRef(activeBranch);
  const [mapError, setMapError] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  // Keep ref in sync so marker click handlers always see latest value
  useEffect(() => { activeBranchRef.current = activeBranch; }, [activeBranch]);

  // Load the Maps SDK once on mount — sets mapsReady when done
  useEffect(() => {
    loadMapsSDK()
      .then(() => setMapsReady(true))
      .catch(() => setMapError(true));
  }, []);

  // Initialize / re-initialize map when city changes OR SDK becomes ready
  useEffect(() => {
    if (!mapsReady || !mapDivRef.current) return;
    const cityBranches = BRANCHES.filter(b => b.city === city);
    const center = CITY_CENTERS[city];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google.maps;

    // Clear old markers
    markersRef.current.forEach(({ marker }) => { marker.map = null; });
    markersRef.current = [];

    const map = new g.Map(mapDivRef.current, {
      center: { lat: center.lat, lng: center.lng },
      zoom: center.zoom,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || 'DEMO_MAP_ID',
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
      clickableIcons: false,
    });

    markersRef.current = cityBranches.map(branch => {
      const isActive = activeBranchRef.current?.slug === branch.slug;
      const pin = makePinElement(g, isActive);
      const marker = new g.marker.AdvancedMarkerElement({
        position: { lat: branch.coordinates.lat, lng: branch.coordinates.lng },
        map,
        title: branch.name,
        content: pin.element,
      });

      marker.addListener('click', () => {
        const cur = activeBranchRef.current;
        setActiveBranch(cur?.slug === branch.slug ? null : branch);
      });

      return { branch, marker };
    });

    return () => {
      markersRef.current.forEach(({ marker }) => { marker.map = null; });
      markersRef.current = [];
    };
  }, [city, mapsReady]);

  // Update marker pin colours when activeBranch changes (no map re-init)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = (window as any).google?.maps;
    if (!g?.marker) return;
    markersRef.current.forEach(({ branch, marker }) => {
      const pin = makePinElement(g, activeBranch?.slug === branch.slug);
      marker.content = pin.element;
    });
  }, [activeBranch]);

  return (
    <div className="sc-city-panel reveal delay-3">
      <div className="sc-city-panel__inner">

        {/* LEFT: Google Map */}
        <div className="sc-gmap-container" ref={mapDivRef} aria-label={`${city} branch map`}>
          {mapError && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '100%', fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-sm)', color: 'var(--mist)'
            }}>
              Map could not be loaded. Please check your connection.
            </div>
          )}
        </div>

        {/* RIGHT: Branch detail card or hint */}
        <div className="sc-branch-detail">
          {activeBranch ? (
            <div className="sc-branch-detail__card" key={activeBranch.slug}>
              <div className="sc-branch-detail__header">
                <span className="sc-branch-detail__name">{activeBranch.name}</span>
                <button className="sc-branch-detail__close"
                  onClick={() => setActiveBranch(null)} aria-label="Close">×</button>
              </div>
              <p className="sc-branch-detail__addr">{activeBranch.address}</p>
              <p className="sc-branch-detail__hours">
                {activeBranch.openHours.days}&nbsp;·&nbsp;{activeBranch.openHours.time}
              </p>
              <div className="sc-branch-actions">
                <a href={`tel:${activeBranch.phone}`} className="sc-branch-action">Call Now</a>
                <a href={`https://wa.me/${activeBranch.whatsapp.replace('+', '')}?text=${encodeURIComponent('Hi, I want to sell my gold. Can you help?')}`}
                  target="_blank" rel="noopener noreferrer" className="sc-branch-action">WhatsApp</a>
                <a href={`/${activeBranch.slug}`} className="sc-branch-action">View Branch</a>
              </div>
            </div>
          ) : (
            <div className="sc-branch-detail__hint">
              <p>Tap a branch<br />on the map<br />to see details</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ─── Branch Finder ────────────────────────────────────────────── */

function BranchFinder() {
  const [activeCity, setActiveCity] = useState<City>('Bangalore');
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);

  const cityArt: Record<City, React.ReactNode> = {
    Bangalore: (
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.75 }}>
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
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.75 }}>
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
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.75 }}>
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
      <svg viewBox="0 0 120 90" style={{ width: '100%', height: 'auto', opacity: 0.75 }}>
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
    <section className="mk-bg-light section" id="branches" aria-label="Branch finder">
      <style>{`
        .sc-city-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2rem; }
        @media (max-width: 640px) { .sc-city-grid { grid-template-columns: repeat(2,1fr); } }
        .sc-city-card { border: 1.5px solid var(--gallery-dk); border-radius: 12px; padding: 1rem; cursor: pointer; background: var(--white); transition: border-color var(--t-base), background var(--t-base), transform var(--t-fast); text-align: center; }
        .sc-city-card:hover { transform: translateY(-2px); }
        .sc-city-card--active { border-color: var(--plum); background: rgba(81,37,97,0.06); }
        .sc-city-name { font-family: 'Tanker', serif; font-size: var(--t-h4); color: var(--plum); margin: 0.5rem 0 0.25rem; }
        .sc-city-count { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); color: var(--ink-mid); }
        @keyframes scPanelIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .sc-city-panel { animation: scPanelIn 380ms cubic-bezier(0.34,1.56,0.64,1) both; margin-bottom: 2rem; }
        .sc-city-panel__inner { display: grid; grid-template-columns: 3fr 2fr; gap: 1.5rem; align-items: start; }
        @media (max-width: 768px) { .sc-city-panel__inner { grid-template-columns: 1fr; } }
        .sc-gmap-container { width: 100%; height: 420px; border-radius: 12px; overflow: hidden; border: 1px solid var(--gallery-dk); box-shadow: 0 20px 48px rgba(81,37,97,0.12), 0 4px 12px rgba(0,0,0,0.05); background: var(--gallery); }
        @media (max-width: 640px) { .sc-gmap-container { height: 300px; } }
        .sc-branch-detail { min-height: 180px; display: flex; align-items: flex-start; }
        @keyframes scDetailIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .sc-branch-detail__card { width: 100%; background: var(--white); border: 1px solid var(--gallery-dk); border-radius: 12px; padding: 1.25rem; animation: scDetailIn 280ms ease both; }
        .sc-branch-detail__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
        .sc-branch-detail__name { font-family: 'Tanker', serif; font-size: var(--t-h4); color: var(--plum); line-height: 1.2; }
        .sc-branch-detail__close { background: none; border: none; cursor: pointer; font-family: 'Tanker', serif; font-size: 1.5rem; color: var(--mist); line-height: 1; padding: 0; transition: color var(--t-fast); }
        .sc-branch-detail__close:hover { color: var(--plum); }
        .sc-branch-detail__addr { font-family: 'Poppins', sans-serif; font-size: var(--t-sm); color: var(--ink-mid); line-height: 1.5; margin-bottom: 0.375rem; }
        .sc-branch-detail__hours { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); color: var(--mist); font-weight: 500; margin-bottom: 1rem; }
        .sc-branch-detail__hint { width: 100%; display: flex; align-items: center; justify-content: center; min-height: 160px; border: 1.5px dashed var(--gallery-dk); border-radius: 12px; font-family: 'Poppins', sans-serif; font-size: var(--t-sm); color: var(--mist); text-align: center; padding: 1.5rem; line-height: 1.8; }
        .sc-branch-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
        .sc-branch-action { font-family: 'Poppins', sans-serif; font-size: var(--t-xs); font-weight: 600; color: var(--plum); text-decoration: none; border: 1px solid rgba(81,37,97,0.3); padding: 0.3rem 0.875rem; border-radius: 9999px; transition: background var(--t-fast), color var(--t-fast); }
        .sc-branch-action:hover { background: var(--plum); color: var(--white); }

        /* ── Coming Soon city cards ───────────────────────── */
        .sc-city-card--coming-soon { opacity: 0.72; }
        .sc-city-card--coming-soon .sc-city-name { color: var(--mist); }
        .sc-city-coming-badge {
          position: absolute;
          top: -4px; right: -8px;
          background: var(--plum);
          color: var(--gold);
          font-family: 'Poppins', sans-serif;
          font-size: 0.55rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 6px;
          border-radius: 9999px;
          white-space: nowrap;
        }
        .sc-coming-soon-panel {
          background: var(--white);
          border: 1.5px solid var(--gallery-dk);
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          animation: scPanelIn 380ms cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .sc-coming-soon-inner {
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        .sc-coming-soon-art {
          width: 120px;
          flex-shrink: 0;
          opacity: 0.5;
        }
        @media (max-width: 480px) {
          .sc-coming-soon-inner { flex-direction: column; gap: 1.25rem; }
          .sc-coming-soon-art { width: 80px; }
          .sc-coming-soon-panel { padding: 1.5rem; }
        }
      `}</style>

      <div className="mk-container">
        <p className="mk-section-overline reveal">16 Branches Across Karnataka</p>
        <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker, serif', fontSize: 'var(--t-h2)', color: 'var(--ink)', marginBottom: '2.5rem' }}>
          Find Your Nearest MK Gold Branch
        </h2>

        <div className="sc-city-grid reveal delay-2">
          {CITIES.map((city) => {
            const count = BRANCHES.filter(b => b.city.toLowerCase() === city.toLowerCase()).length;
            const isComingSoon = city !== 'Bangalore';
            return (
              <button
                key={city}
                onClick={() => { setActiveCity(city); setActiveBranch(null); }}
                className={`sc-city-card${activeCity === city ? ' sc-city-card--active' : ''}${isComingSoon ? ' sc-city-card--coming-soon' : ''}`}
              >
                <div style={{ width: '100%', maxWidth: '96px', margin: '0 auto', position: 'relative' }}>
                  {cityArt[city]}
                  {isComingSoon && (
                    <span className="sc-city-coming-badge">Coming Soon</span>
                  )}
                </div>
                <p className="sc-city-name">{city}</p>
                <p className="sc-city-count">{isComingSoon ? 'Coming Soon' : `${count} ${count === 1 ? 'branch' : 'branches'}`}</p>
              </button>
            );
          })}
        </div>

        {activeCity === 'Bangalore' ? (
          <GoogleCityMap
            key={activeCity}
            city={activeCity}
            activeBranch={activeBranch}
            setActiveBranch={setActiveBranch}
          />
        ) : (
          <div className="sc-coming-soon-panel">
            <div className="sc-coming-soon-inner">
              <div className="sc-coming-soon-art" aria-hidden="true">
                {cityArt[activeCity]}
              </div>
              <div>
                <p className="mk-section-overline" style={{ marginBottom: '0.5rem' }}>Coming Soon</p>
                <h3 style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h3)', color: 'var(--plum)', margin: '0 0 0.75rem', lineHeight: 1.1 }}>
                  MK Gold {activeCity}
                </h3>
                <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-sm)', color: 'var(--ink-mid)', lineHeight: 1.65, margin: '0 0 1.25rem', maxWidth: '340px' }}>
                  We are opening branches in {activeCity} soon. Get notified when we launch — leave your number and we will call you first.
                </p>
                <a
                  href="tel:+917019500600"
                  style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 'var(--t-sm)', color: 'var(--plum)', textDecoration: 'none', borderBottom: '1.5px solid var(--plum)' }}
                >
                  +91 70195 00600
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Trust section data (mirrors MkTrust) ─────────────────────── */

const TRUST_PILLARS = [
  { label: 'ISO 9001:2015 Certified', detail: 'Quality management certified. Every process — weighing, testing, payment — is audited and documented.' },
  { label: 'German XRF Spectrometer', detail: 'We use a Bruker S1 Titan XRF spectrometer. It reads exact gold content. No acid. No guesswork.' },
  { label: 'Live MCX Rate Transparency', detail: 'Our buying rate is displayed beside the MCX rate so you can see exactly what we earn. Nothing hidden.' },
  { label: 'Est. 2014 — 15+ Years', detail: '10,000+ transactions across Karnataka. A business built on repeat customers and word-of-mouth alone.' },
  { label: 'Confidential Service', detail: 'Private consultation rooms. Discreet transactions. Your decision to sell gold is yours — we never judge.' },
  { label: 'Post-Sale Support', detail: 'WhatsApp support after your transaction. Grievance email in footer. We stand behind every offer we make.' },
] as const;

const TRUST_BADGES = ['GST Registered', 'ISO 9001:2015', 'XRF Certified', '16 Physical Branches'] as const;

/* ─── Auto-spinning trust coin ──────────────────────────────────── */

function TrustCoin() {
  const faceStyle: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <div className="mk-trust__seals reveal">
      <div style={{ width: '130px', height: '130px', perspective: '600px', position: 'relative' }}>
        <div className="mk-coin-spin" style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>
          <div style={faceStyle}><MkSeal variant="en" size="lg" /></div>
          <div style={{ ...faceStyle, transform: 'rotateY(180deg)' }}><MkSeal variant="kn" size="lg" /></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Local trust section ───────────────────────────────────────── */

function LocalTrustSection() {
  return (
    <section className="mk-trust mk-bg-dark section" id="why-mk-gold">
      <div className="mk-container mk-trust__inner">
        <div className="mk-trust__left">
          <TrustCoin />
          <div className="reveal delay-1">
            <p className="mk-section-overline">Why MK Gold</p>
            <h2 className="mk-trust__headline">
              Trust is built in <span className="mk-trust__accent">every detail.</span>
            </h2>
            <p className="mk-trust__intro">
              We have spent 15+ years earning the trust of Karnataka&apos;s gold sellers —
              not through advertising, but through transparent process, fair rates,
              and respectful service.
            </p>

            {/* 4.9 rating + 15+ years stat row */}
            <div className="sc-trust-stats reveal delay-2">
              {/* 4.9 Google Rating */}
              <div className="sc-trust-stat sc-trust-stat--rating" style={{ animation: 'mk-rating-glow 2.5s ease-in-out infinite' }}>
                <span className="sc-trust-stat__score">4.9</span>
                <div className="sc-trust-stat__stars" aria-label="4.9 out of 5 stars">
                  {[0, 1, 2, 3, 4].map(i => (
                    <span key={i} className="sc-trust-star" style={{
                      animation: 'mk-star-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
                      animationDelay: `${i * 0.08}s`,
                    }} aria-hidden="true" />
                  ))}
                </div>
                <span className="sc-trust-stat__label">Google Rating</span>
              </div>

              <div className="sc-trust-stat-divider" aria-hidden="true" />

              {/* 15+ Years */}
              <div className="sc-trust-stat">
                <span className="sc-trust-stat__score">15+</span>
                <span className="sc-trust-stat__label">Years Trusted</span>
                <span className="sc-trust-stat__sub">Est. 2014</span>
              </div>
            </div>
          </div>
          <div className="mk-trust__badges reveal delay-3" aria-label="Certifications">
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

/* ─── Steps data + local section ───────────────────────────────── */

const SC_STEPS = [
  { n: '01', title: 'Book Appointment', body: 'Call, WhatsApp, or book online in 30 seconds. No documents or paperwork needed at this stage.' },
  { n: '02', title: 'Visit Any Branch', body: 'Walk into any of our 16 branches with your gold and a valid government ID. Walk-ins always welcome.' },
  { n: '03', title: 'Weigh & Assess', body: 'Your gold is weighed on certified precision scales in front of you. Transparent process, zero hidden deductions.' },
  { n: '04', title: 'XRF Purity Test', body: 'Our German XRF spectrometer reads exact gold content in under 2 minutes. No acid test. No scratches.' },
  { n: '05', title: 'Receive Your Offer', body: 'You get an offer based on live MCX rates. We show you our margin openly, side by side. Zero pressure.' },
  { n: '06', title: 'Get Paid Instantly', body: 'Accept and receive payment in cash, NEFT, or UPI within 30 minutes. Walk in with gold, walk out with money.' },
] as const;

function LocalStepsSection() {
  return (
    <section className="mk-bg-light section" id="how-it-works">
      <div className="mk-container">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 3.5rem' }}>
          <p className="mk-section-overline">How It Works</p>
          <h2 style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h1)', color: 'var(--ink)', lineHeight: 1.05, marginBottom: '1rem' }}>
            Six steps. 30 minutes.<br />That&apos;s all it takes.
          </h2>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', lineHeight: 1.65 }}>
            Sell your gold at fair, transparent rates backed by live MCX prices and certified XRF purity testing.
          </p>
        </div>
        <ol className="sc-steps-grid" aria-label="Steps to sell your gold">
          {SC_STEPS.map((step, i) => (
            <li key={step.n} className={`sc-step reveal delay-${(i % 3) + 1}`}>
              <span className="sc-step__number" aria-hidden="true">{step.n}</span>
              <h3 className="sc-step__title">{step.title}</h3>
              <p className="sc-step__body">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─── ScrollToTop (fixed bottom-right — appears when past hero) ── */

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[aria-label="Hero"]');
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className="sc-scroll-top"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 350ms ease, transform 350ms cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      ↑
    </button>
  );
}

/* ─── BottomNav (floating pill — appears when past hero) ───────── */

function BottomNav() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[aria-label="Hero"]');
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? '917019500600'}?text=Hi%2C%20I%20want%20to%20sell%20my%20gold.`;

  return (
    <>
      <div
        className="sc-bottom-nav-wrap"
        style={{
          opacity: pastHero ? 1 : 0,
          transform: pastHero
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(120%)',
          transition: 'all 420ms cubic-bezier(0.34, 1.2, 0.64, 1)',
        }}
        aria-hidden={!pastHero}
      >
        <div className="sc-bottom-nav" role="navigation" aria-label="Quick actions">
          <a
            href="#branches"
            className="sc-bn-btn sc-bn-btn--ghost sc-bn-hide-768"
            onClick={(e) => { e.preventDefault(); document.getElementById('branches')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            Find Branch
          </a>
          <a
            href="#gold-rate"
            className="sc-bn-btn sc-bn-btn--gold sc-bn-hide-600"
            onClick={(e) => { e.preventDefault(); document.getElementById('gold-rate')?.scrollIntoView({ behavior: 'smooth' }); }}
          >
            <span className="sc-bn-live-dot" aria-hidden="true" />
            Live Gold Rate
          </a>
          <a href="/sell-gold" className="sc-bn-btn sc-bn-btn--primary">
            Sell Gold
          </a>
          <span className="sc-bn-sep" aria-hidden="true" />
          <a href={`tel:${process.env.NEXT_PUBLIC_PHONE_DEFAULT ?? '+917019500600'}`} className="sc-bn-phone sc-bn-hide-360">
            <img src="/phone_icon.png" alt="" width={22} height={22} className="sc-bn-icon" aria-hidden="true" />
            <span className="sc-bn-phone-text sc-bn-hide-900">+91 70195 00600</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-bn-btn sc-bn-btn--whatsapp"
          >
            <img src="/whatsapp_icon.png" alt="" width={22} height={22} className="sc-bn-icon" aria-hidden="true" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */

export default function HomePage({ homeFaqs }: { homeFaqs?: FaqItem[] }) {
  const [scrollPct, setScrollPct] = useState(0);

  const [slide, setSlide] = useState(0);
  const [rateUnlocked, setRateUnlocked] = useState(false);
  const [banners, setBanners] = useState<{ src: string; alt: string }[]>(FALLBACK_BANNERS);
  const [googleReviews, setGoogleReviews] = useState<{ name: string; area: string; rating: number; text: string; initials: string }[]>([]);

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          setGoogleReviews(data.reviews.map((r: { author: string; quote: string; rating: number; date: string }) => ({
            name: r.author,
            area: r.date,
            rating: r.rating,
            text: r.quote,
            initials: r.author.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
          })));
        }
      })
      .catch(() => { /* keep empty — section shows loading state */ });
  }, []);

  useEffect(() => {
    fetch('/api/banners')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners.map((b: { src: string; alt: string }) => ({ src: b.src, alt: b.alt })));
        }
      })
      .catch(() => { /* keep fallback */ });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    const id = setInterval(() => setSlide(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  function goToSlide(i: number) {
    setSlide(i);
  }

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
          height: 85px !important;
        }
        .mk-navbar__inner {
          gap: 1rem !important;
        }
        .mk-navbar__nav {
          gap: 0 !important;
        }
        .mk-navbar__link {
          font-size: 0.875rem !important;
          padding: 0.375rem 0.625rem !important;
        }
        .mk-navbar__actions > .mk-btn {
          font-size: 0.9rem !important;
          padding: 0.56rem 1.4rem !important;
        }
        .mk-navbar__extra-ctas .mk-btn {
          font-size: 0.8rem !important;
          padding: 0.4rem 0.875rem !important;
        }
        .mk-ticker { top: 0 !important; }

        /* ── Hero ─────────────────────────────────────────── */
        .sc-hero {
          position: relative;
          height: 100svh !important;
          min-height: 560px !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .sc-hero {
            height: auto !important;
            min-height: unset !important;
            aspect-ratio: 16 / 9;
            overflow: hidden !important;
          }
        }
        @media (max-width: 768px) {
          .sc-hero__banner {
            object-position: 25% center !important;
          }
        }
        @media (max-width: 768px) {
          .sc-hero__dots {
            bottom: 0.75rem !important;
          }
        }
        .sc-hero__overlay {
          display: none;
        }
        .sc-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }
        .sc-hero__banner {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0;
          transition: opacity 0.9s ease;
          pointer-events: none;
          user-select: none;
        }
        .sc-hero__banner--active {
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


        /* ── Rate + Chart section ──────────────────────────── */
        .sc-rate-section { position: relative; }

        .sc-rate-top-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
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

        /* ── CTA band — light bg override (wrapper has mk-bg-light) ── */
        .sc-light-cta .mk-cta-band {
          background-color: transparent !important;
          background-image: none !important;
        }
        .sc-light-cta .mk-cta-band__headline { color: var(--ink) !important; }
        .sc-light-cta .mk-cta-band__sub { color: var(--ink-mid) !important; }
        .sc-light-cta .mk-cta-band__note { color: var(--mist) !important; }
        .sc-light-cta .mk-btn--outline-light {
          color: var(--plum) !important;
          border-color: rgba(81,37,97,0.4) !important;
        }
        .sc-light-cta .mk-btn--outline-light:hover {
          background: var(--plum) !important;
          color: var(--white) !important;
          border-color: var(--plum) !important;
        }

        /* ── Hero coin — 70/30 overlap, static 3D ─────────── */
        /* Allow coin to bleed below hero — bg elements are all inset-0 so safe */
        .sc-hero { overflow: visible !important; z-index: 2; }
        .sc-no-gap { position: relative; z-index: 1; }

        /* Rate section gets coin clearance now that StatBand is gone */
        .sc-rate-section { padding-top: 5rem !important; }
        @media (max-width: 768px) {
          .sc-rate-section { padding-top: 2.5rem !important; }
        }
        @media (max-width: 480px) {
          .sc-rate-section { padding-top: 2rem !important; }
        }

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
        .sc-coin-perspective {
          perspective: 700px;
          position: relative;
          width: 220px;
          height: 220px;
        }

        /* Override MkSeal's inline 120px width/height so coin renders at full size */
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

        /* Coin responsive breakpoints */
        @media (max-width: 1024px) {
          .sc-coin-anchor { width: 160px; bottom: -48px; }
          .sc-coin-perspective { width: 160px; height: 160px; }
        }
        @media (max-width: 768px) {
          .sc-coin-anchor { display: none !important; }
          .sc-coin-hint   { display: none !important; }
        }


        /* ── How It Works — dark premium cards ─────────────── */
        .sc-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          list-style: none;
          padding: 0; margin: 0;
        }
        @media (max-width: 860px) { .sc-steps-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 540px) { .sc-steps-grid { grid-template-columns: 1fr; } }

        .sc-step {
          background: var(--white);
          border: 1.5px solid var(--gallery-dk);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          position: relative;
          overflow: hidden;
          transition: transform 350ms cubic-bezier(0.34,1.56,0.64,1),
                      border-color 260ms ease,
                      box-shadow 260ms ease;
        }
        .sc-step::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
            rgba(223,193,96,0.06) 0%,
            rgba(123,44,145,0.05) 100%);
          opacity: 0;
          transition: opacity 300ms ease;
          pointer-events: none;
        }
        .sc-step:hover {
          transform: translateY(-6px);
          border-color: rgba(223,193,96,0.55);
          box-shadow: 0 12px 40px rgba(0,0,0,0.1),
                      0 0 0 1px rgba(223,193,96,0.15);
        }
        .sc-step:hover::before { opacity: 1; }
        .sc-step__number {
          font-family: 'Tanker', serif;
          font-size: 3.25rem;
          line-height: 1;
          display: block;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, #DFC160 0%, rgba(223,193,96,0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: transform 350ms cubic-bezier(0.34,1.56,0.64,1);
        }
        .sc-step:hover .sc-step__number { transform: scale(1.08); }
        .sc-step__title {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-h4);
          font-weight: 600;
          color: var(--ink);
          margin: 0 0 0.625rem;
          line-height: 1.25;
        }
        .sc-step__body {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--ink-mid);
          line-height: 1.65;
          margin: 0;
        }

        /* ── Scroll to top button ────────────────────────────────── */
        .sc-scroll-top {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 400;
          width: 48px; height: 48px;
          border-radius: 50%;
          background: var(--plum-deep);
          border: 1.5px solid rgba(223,193,96,0.45);
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(223,193,96,0.1);
          will-change: transform, opacity;
        }
        .sc-scroll-top:hover {
          background: var(--plum);
          border-color: rgba(223,193,96,0.75);
          box-shadow: 0 6px 28px rgba(0,0,0,0.45), 0 0 12px rgba(223,193,96,0.2);
        }

        /* ── Floating pill bottom nav ─────────────────────────────── */
        .sc-bottom-nav-wrap {
          position: fixed;
          bottom: 1.25rem;
          left: 50%;
          z-index: 350;
          width: min(1120px, calc(100vw - 2rem));
          pointer-events: none;
          will-change: transform, opacity;
        }
        .sc-bottom-nav {
          pointer-events: all;
          background: var(--plum-deep);
          border-radius: 9999px;
          border: 1px solid rgba(223,193,96,0.22);
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.07);
          height: 68px;
          display: flex;
          align-items: center;
          padding: 0 0.875rem 0 1rem;
          gap: 0.5rem;
          overflow: hidden;
        }
        .sc-bn-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          font-family: 'Poppins', sans-serif;
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          white-space: nowrap;
          cursor: pointer;
          text-decoration: none;
          flex-shrink: 0;
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
          padding: 0 1.1rem;
          height: 44px;
          border: 1.5px solid transparent;
        }
        .sc-bn-btn--ghost {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.82);
        }
        .sc-bn-btn--ghost:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.28);
        }
        .sc-bn-btn--gold {
          background: var(--gold);
          color: var(--plum);
          border-color: transparent;
          font-weight: 700;
          gap: 0.4rem;
        }
        .sc-bn-btn--gold:hover {
          background: var(--gold-light);
          box-shadow: 0 4px 16px rgba(223,193,96,0.4);
        }
        .sc-bn-btn--primary {
          background: var(--purple);
          color: white;
          border-color: transparent;
          font-weight: 700;
          box-shadow: 0 2px 12px rgba(123,44,145,0.45);
        }
        .sc-bn-btn--primary:hover {
          background: #8D35A8;
          box-shadow: 0 4px 20px rgba(123,44,145,0.60);
        }
        .sc-bn-btn--whatsapp {
          background: #25D366;
          color: white;
          border-color: transparent;
          font-weight: 700;
          gap: 0.4rem;
          box-shadow: 0 2px 10px rgba(37,211,102,0.35);
        }
        .sc-bn-btn--whatsapp:hover {
          background: #1EA855;
          box-shadow: 0 4px 16px rgba(37,211,102,0.50);
        }
        .sc-bn-live-dot {
          display: inline-block;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #4ade80;
          flex-shrink: 0;
          vertical-align: middle;
          animation: livePulse 2s ease-in-out infinite;
        }
        .sc-bn-icon {
          width: 22px; height: 22px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          flex-shrink: 0;
          display: block;
        }
        .sc-bn-sep {
          display: inline-block;
          width: 1px; height: 28px;
          background: rgba(255,255,255,0.12);
          margin: 0 0.375rem 0 auto;
          flex-shrink: 0;
        }
        .sc-bn-phone {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.05);
          text-decoration: none;
          transition: background 150ms ease;
          flex-shrink: 0;
        }
        .sc-bn-phone:hover { background: rgba(255,255,255,0.10); }
        .sc-bn-phone-text {
          font-family: 'Poppins', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          color: white;
          white-space: nowrap;
        }
        @media (max-width: 900px)  { .sc-bn-hide-900 { display: none !important; } }
        @media (max-width: 768px)  { .sc-bn-hide-768 { display: none !important; } }
        @media (max-width: 600px)  { .sc-bn-hide-600 { display: none !important; } }
        @media (max-width: 480px)  {
          .sc-bn-btn { padding: 0 0.875rem; font-size: 0.75rem; }
          .sc-bottom-nav { height: 60px; }
          .sc-bottom-nav-wrap { bottom: 1rem; }
        }
        @media (max-width: 360px)  {
          .sc-bn-hide-360 { display: none !important; }
          .sc-bottom-nav-wrap { width: calc(100vw - 1.5rem); }
          .sc-bn-btn--primary, .sc-bn-btn--whatsapp { flex: 1; justify-content: center; }
        }

        /* ── FAQ accordion — explicit colours so open state never goes white ── */
        .mk-faq__item { background: var(--white); }
        .mk-faq__trigger { background: var(--white) !important; }
        .mk-faq__trigger:hover { background: var(--gallery) !important; }
        .mk-faq__item--open .mk-faq__trigger {
          background: rgba(81,37,97,0.06) !important;
          border-bottom: 1px solid rgba(81,37,97,0.10);
        }
        .mk-faq__answer { background: var(--white); }
        .mk-faq__answer-text { color: var(--ink-mid) !important; opacity: 1 !important; }
        .mk-faq__icon { border-color: var(--gallery-dk) !important; }
        .mk-faq__item--open .mk-faq__icon {
          border-color: var(--plum) !important;
          background: rgba(81,37,97,0.06);
        }

        /* ── Navbar CTAs — uniform size ──────────────────────────── */
        .mk-navbar__actions .mk-btn {
          font-size: 0.875rem !important;
          padding: 0.6rem 1.4rem !important;
          height: 38px !important;
          min-height: 38px !important;
          line-height: 1 !important;
          display: inline-flex !important;
          align-items: center !important;
        }
        /* ── Popup animations ────────────────────────────────────── */
        @keyframes lp-popupSlideIn {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes lp-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Popup form ──────────────────────────────────────────── */
        .lp-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .lp-form-label {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-mid);
          margin-bottom: 0.375rem;
        }

        /* ── iOS zoom prevention (16px min on all inputs) ────────── */
        .mk-input, .mk-select, .mk-textarea { font-size: max(16px, var(--t-sm)) !important; }

        /* ── Fix 1: global overflow prevention ─────────────────── */
        html { overflow-x: hidden; }
        body { overflow-x: hidden; }

        /* ── Trust section — 4.9 + 15yr stat row ────────────────── */
        .sc-trust-stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .sc-trust-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }
        .sc-trust-stat--rating {
          background: var(--plum);
          border-radius: 14px;
          padding: 0.875rem 1.125rem;
          border: 1px solid rgba(223,193,96,0.25);
        }
        .sc-trust-stat__score {
          font-family: 'Tanker', serif;
          font-size: clamp(2rem, 4vw, 2.75rem);
          color: var(--gold);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .sc-trust-stat__stars {
          display: flex;
          gap: 3px;
          margin: 0.2rem 0;
        }
        .sc-trust-star {
          display: inline-block;
          width: 14px;
          height: 14px;
          background: var(--gold);
          clip-path: polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);
        }
        .sc-trust-stat__label {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-2xs);
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }
        .sc-trust-stat__sub {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: rgba(255,255,255,0.45);
          margin-top: 0.1rem;
        }
        .sc-trust-stat-divider {
          width: 1px;
          height: 56px;
          background: rgba(255,255,255,0.15);
          align-self: center;
        }

        /* ── Gate section — two-state layout ────────────────────── */
        .sc-gate-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.25rem;
          padding: 2rem 2.5rem;
        }
        .sc-gate-bullets {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .sc-gate-bullets li {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          line-height: 1.4;
        }
        .sc-gate-bullets li::before {
          content: '—';
          color: var(--gold);
          font-family: 'Tanker', serif;
          font-size: 0.875rem;
          flex-shrink: 0;
        }
        .sc-gate-card {
          background: var(--white);
          border-radius: 20px;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          box-shadow: 0 24px 64px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2);
        }
        .sc-gate-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-sm);
          color: var(--gold-deep);
          margin: 0 0 0.25rem;
        }
        .sc-gate-card .mk-input,
        .sc-gate-card .mk-select {
          background: var(--gallery) !important;
          border-color: var(--gallery-dk) !important;
          color: var(--ink) !important;
        }
        .sc-gate-card .mk-calc__label,
        .sc-gate-card label {
          color: var(--ink-mid) !important;
        }
        .sc-gate-card .mk-select--dark {
          background: var(--gallery) !important;
          border-color: var(--gallery-dk) !important;
          color: var(--ink) !important;
        }
        .sc-gate-card select option {
          background-color: var(--white) !important;
          color: var(--ink) !important;
        }
        .sc-gate-privacy {
          font-family: 'Poppins', sans-serif;
          font-size: var(--t-xs);
          color: var(--mist);
          text-align: center;
          margin: 0.25rem 0 0;
        }
        @media (max-width: 768px) {
          .sc-gate-copy { padding: 1.75rem 1.5rem; }
          .sc-gate-card { padding: 1.5rem; }
        }

        /* ── Fix 3B: callback form responsive grid ───────────────── */
        .sc-callback-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 600px) {
          .sc-callback-grid { grid-template-columns: 1fr; }
        }

        /* ── Fix 4: reviews carousel mobile animation ────────────── */
        @keyframes reviewsScrollMobile {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-1 * (280px * 6 + 1.25rem * 6))); }
        }
        @media (max-width: 640px) {
          .sc-reviews-track { animation-name: reviewsScrollMobile !important; }
        }
        .sc-review-text {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
        }

        /* ── Fix 5: scroll-to-top above bottom nav on mobile ─────── */
        @media (max-width: 768px) {
          .sc-scroll-top {
            bottom: 5.75rem !important;
            right: 0.875rem !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 1rem !important;
          }
        }

        /* ── Fix 6: bottom nav overflow at 320–400px ─────────────── */
        @media (max-width: 400px) {
          .sc-bottom-nav {
            height: 60px !important;
            padding: 0 0.5rem 0 0.625rem !important;
            gap: 0.3rem !important;
          }
          .sc-bn-btn {
            padding: 0 0.625rem !important;
            font-size: 0.72rem !important;
            height: 38px !important;
          }
          .sc-bn-hide-768 { display: none !important; }
          .sc-bn-phone   { display: none !important; }
        }
        @media (max-width: 340px) {
          .sc-bottom-nav-wrap { width: calc(100vw - 1rem) !important; }
          .sc-bn-btn { padding: 0 0.5rem !important; font-size: 0.675rem !important; }
          .sc-bn-btn--gold { display: none !important; }
        }

        /* ── Fix 7: navbar inner panel tight on small screens ─────── */
        @media (max-width: 480px) {
          .mk-navbar__inner {
            margin: 8px 10px !important;
            padding: 0 0.75rem !important;
            gap: 0.5rem !important;
          }
        }
        @media (max-width: 360px) {
          .mk-navbar__inner { margin: 6px 8px !important; }
          .mk-navbar__logo-img { height: 44px !important; }
        }

        /* ── Fix 8: rate widget padding mobile ───────────────────── */
        @media (max-width: 480px) {
          .mk-rate-widget {
            padding: var(--s-5) !important;
            gap: var(--s-4) !important;
          }
          .mk-rate-widget__cell { padding: var(--s-3) !important; }
          .mk-rate-widget__value { font-size: 1rem !important; }
          .mk-rate-widget__calc-inputs { grid-template-columns: 1fr !important; }
          .mk-rate-widget__margin-row { flex-wrap: wrap; }
          .mk-rate-widget__margin-sep { display: none; }
          .mk-rate-widget__margin-pill { width: 100%; text-align: center; }
        }

        /* ── Fix 9: dark card padding + title size mobile ────────── */
        @media (max-width: 480px) {
          .sc-card-dark  { padding: 1.25rem !important; }
          .sc-card-title { font-size: 1.25rem !important; }
          .sc-card-sub   { font-size: var(--t-xs) !important; margin-bottom: 0.875rem !important; }
        }


        /* ── Fix 11: steps cards tighter on mobile ───────────────── */
        @media (max-width: 480px) {
          .sc-step { padding: 1.25rem; }
          .sc-step__number { font-size: 2.75rem; margin-bottom: 0.5rem; }
          .sc-step__title  { font-size: 1rem; }
          .sc-step__body   { font-size: var(--t-xs); }
        }

        /* ── Fix 12: lead popup very small screens ───────────────── */
        @media (max-width: 380px) {
          [role="dialog"] > div:first-child { padding: 1.125rem 1.25rem !important; }
          [role="dialog"] > div:last-child  { padding: 1.25rem !important; }
          [role="dialog"] h2 { font-size: 1.5rem !important; }
          .lp-form-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
        }

        /* ── Fix 13: CTA band buttons stack on mobile ────────────── */
        @media (max-width: 480px) {
          .mk-cta-band__actions {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
          }
          .mk-cta-band__actions .mk-btn { justify-content: center; }
        }

        /* ── Fix 14: section padding on small screens ────────────── */
        @media (max-width: 480px) {
          .section          { padding-block: 3rem !important; }
          .mk-faq           { padding-block: 3rem 3.5rem !important; }
          .mk-cta-band      { padding-block: 3rem 3.5rem !important; }
          .mk-trust         { padding-block: 3rem 3.5rem !important; }
          .sc-rate-section  { padding-top: 2rem !important; }
          .lp-form-grid     { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 375px) {
          .sc-rate-top-grid { grid-template-columns: 1fr !important; }
          .lp-form-grid     { grid-template-columns: 1fr !important; }
        }

        /* ── Fix 15: Google Maps height very small screens ───────── */
        @media (max-width: 380px) {
          .sc-gmap-container { height: 240px !important; }
        }
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
        {banners.map((b, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={b.src}
            src={b.src}
            alt={b.alt}
            className={`sc-hero__banner${i === slide ? ' sc-hero__banner--active' : ''}`}
            aria-hidden={i !== slide}
            draggable={false}
          />
        ))}
        <div className="sc-hero__overlay" />
        <div className="sc-grain" />

        {/* ── Overlapping coin anchor — 70% hero / 30% below ── */}
        <div className="sc-coin-anchor">
          {/* Outer: gold glow */}
          <div className="sc-coin-wobble">
            {/* Perspective wrapper */}
            <div className="sc-coin-perspective" aria-label="MK Gold seal — MK Andare Nambike">
              {/* Inner: auto-spinning EN front / KN back */}
              <div className="mk-coin-spin" style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="en" size="lg" />
                </div>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as 'hidden', transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="kn" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="sc-hero__dots" role="tablist" aria-label="Hero slides">
          {banners.map((_, i) => (
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

      {/* ── Rate section — continuous dark bg ──────────────────── */}
      <div className="mk-bg-dark sc-no-gap">

        {/* ── Rate + Calculator + Callback + Chart ────────────────── */}
        <section className="sc-rate-section section" id="gold-rate">
          <div className="mk-container" style={{ position: 'relative' }}>
            {rateUnlocked && (
              <>
                <p className="mk-section-overline reveal">Live Gold Rate Karnataka</p>
                <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: '#fff', marginBottom: '2.5rem' }}>
                  Today&apos;s Rate &amp; Calculator
                </h2>
              </>
            )}

            {/* Gate state — marketing copy (left) + form card (right) */}
            {!rateUnlocked && (
              <div className="sc-rate-top-grid">
                {/* Left: pitch copy */}
                <div className="sc-gate-copy reveal delay-1">
                  <p className="mk-section-overline">Gold Value Estimator</p>
                  <h2 style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h1)', color: 'white', lineHeight: 1.05, margin: 0 }}>
                    Calculate Your Gold Value
                  </h2>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-base)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: 0 }}>
                    Get an instant, accurate estimate of your gold&apos;s worth based on current live market rates and purity. No obligation — just clarity.
                  </p>
                  <ul className="sc-gate-bullets">
                    <li>XRF-verified purity testing</li>
                    <li>Live MCX market pricing applied</li>
                    <li>Instant bank transfer on sale</li>
                  </ul>
                </div>

                {/* Right: white card form */}
                <div className="sc-gate-card reveal delay-2">
                  <div>
                    <h3 style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h3)', color: 'var(--ink)', margin: '0 0 0.25rem', lineHeight: 1.1 }}>
                      Calculate Your Gold Value
                    </h3>
                    <p className="sc-gate-subtitle">Enter your details to unlock the live calculator</p>
                  </div>
                  <CallbackForm onSuccess={() => setRateUnlocked(true)} />
                  <p className="sc-gate-privacy">Your details are safe &amp; never shared.</p>
                </div>
              </div>
            )}

            {/* Unlocked state — rate widget (left) + calculator (right) */}
            {rateUnlocked && (
              <div className="sc-rate-top-grid" style={{ animation: 'fadeUp 0.4s ease both' }}>
                <div className="sc-chart-card">
                  <MkRateWidget variant="page" />
                </div>
                <div className="sc-chart-card">
                  <MkCalculator variant="dark" defaultUnlocked showBookingCTA />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>{/* end continuous dark: StatBand + Rate */}

      {/* ── How it works ────────────────────────────────────────── */}
      <LocalStepsSection />

      {/* ── Emergency callout ───────────────────────────────────── */}
      <MkEmergency />

      {/* ── Trust architecture ──────────────────────────────────── */}
      <LocalTrustSection />

      {/* ── Branch finder ───────────────────────────────────────── */}
      <BranchFinder />

      {/* ── Google Reviews: infinite scroll carousel ────────────── */}
      <section className="mk-bg-light section" id="reviews">
        <div className="mk-container">
          <div className="reveal" style={{ maxWidth: '42rem', marginBottom: '2rem' }}>
            <p className="mk-section-overline">Google Reviews</p>
            <h2 className="reveal delay-1" style={{ fontFamily: 'Tanker,serif', fontSize: 'var(--t-h2)', color: 'var(--ink)', marginBottom: '0.75rem' }}>
              4.9 Stars Across All Branches
            </h2>
            <p className="reveal delay-2" style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-base)', color: 'var(--ink-mid)', marginBottom: 0, maxWidth: '540px' }}>
              Real reviews from real customers
            </p>
          </div>
        </div>

        {/* Carousel — only renders once reviews are fetched */}
        {googleReviews.length > 0 && (
          <div style={{ overflow: 'hidden', paddingBottom: '0.5rem' }}>
            <div className="sc-reviews-track">
              {[...googleReviews, ...googleReviews].map((t, i) => (
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
        )}
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <MkFaq faqs={homeFaqs} />

      {/* ── CTA Band ─────────────────────────────────────────────── */}
      <div className="mk-bg-light sc-light-cta">
        <MkCtaBand />
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <MkFooter />

      <ScrollToTop />
      <BottomNav />
      <MkLeadPopup />
    </>
  );
}
