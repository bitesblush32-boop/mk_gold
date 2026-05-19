'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
        <h3 className="sc-tanker-h3" style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>
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

      <div className="mk-container">
        <p className="mk-section-overline reveal">16 Branches Across Karnataka</p>
        <h2 className="reveal delay-1 t-h2" style={{ marginBottom: '2.5rem' }}>
          Find Your Nearest MK Gold Branch
        </h2>

        <div className="sc-city-grid reveal delay-2">
          {CITIES.map((city) => {
            const count = BRANCHES.filter(b => b.city.toLowerCase() === city.toLowerCase()).length;
            return (
              <button
                key={city}
                onClick={() => { setActiveCity(city); setActiveBranch(null); }}
                className={`sc-city-card${activeCity === city ? ' sc-city-card--active' : ''}`}
              >
                <div style={{ width: '100%', maxWidth: '96px', margin: '0 auto', position: 'relative' }}>
                  {cityArt[city]}
                </div>
                <p className="sc-city-name">{city}</p>
                <p className="sc-city-count">{count} {count === 1 ? 'branch' : 'branches'}</p>
              </button>
            );
          })}
        </div>

        <GoogleCityMap
          key={activeCity}
          city={activeCity}
          activeBranch={activeBranch}
          setActiveBranch={setActiveBranch}
        />
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
          <h2 className="t-h1" style={{ lineHeight: 1.05, marginBottom: '1rem' }}>
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
          transition: 'opacity 420ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 420ms cubic-bezier(0.34, 1.2, 0.64, 1)',
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
            <span className="sc-bn-phone-text sc-bn-hide-900">+91 70195 00600</span>
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-bn-btn sc-bn-btn--whatsapp"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

/* ─── Page ─────────────────────────────────────────────────────── */

export default function HomePage({ homeFaqs, initialBanners = [] }: {
  homeFaqs?: FaqItem[];
  initialBanners?: { src: string; alt: string }[];
}) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [slide, setSlide] = useState(0);
  const [rateUnlocked, setRateUnlocked] = useState(false);
  const [banners, setBanners] = useState<{ src: string; alt: string }[]>(initialBanners);
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
    // Only fetch from the API if the server didn't provide banners.
    // When initialBanners is populated it comes from a direct DB read at SSR time
    // and is always fresher than the edge-cached /api/banners response (which can
    // lag by up to 10 min due to stale-while-revalidate), so we must not override it.
    if (initialBanners.length > 0) return;
    fetch('/api/banners')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.banners) && data.banners.length > 0) {
          setBanners(data.banners.map((b: { src: string; alt: string }) => ({ src: b.src, alt: b.alt })));
        }
      })
      .catch(() => { /* keep current banners */ });
  }, []);

  useEffect(() => {
    const el = progressBarRef.current;
    const handleScroll = () => {
      if (!el) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? window.scrollY / docH : 0;
      el.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    if (banners.length < 2) return;
    const id = setInterval(() => setSlide(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(id);
  }, [banners.length]);

  function goToSlide(i: number) {
    setSlide(i);
  }

  return (
    <>

      {/* ── Scroll progress bar — direct DOM update, no React re-render ── */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '4px', zIndex: 999, background: 'rgba(40,12,56,0.85)' }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: '100%',
            width: '100%',
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            background: 'linear-gradient(90deg, #512561 0%, #7B2C91 40%, #DFC160 80%, #EDD47A 100%)',
            boxShadow: '0 1px 8px rgba(223,193,96,0.55), 0 2px 4px rgba(123,44,145,0.4)',
          }}
        />
      </div>

      <MkTicker />
      <MkNavbar />

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="sc-hero mk-bg-dark" aria-label="Hero">
        {banners.map((b, i) => (
          <Image
            key={b.src}
            src={b.src}
            alt={b.alt}
            fill
            sizes="100vw"
            quality={85}
            priority={i === 0}
            className={`sc-hero__banner${i === slide ? ' sc-hero__banner--active' : ''}`}
            aria-hidden={i !== slide}
            draggable={false}
            style={{ objectFit: 'cover' }}
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
                <h2 className="reveal delay-1 t-h2" style={{ marginBottom: '2.5rem' }}>
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
                  <h2 className="t-h1" style={{ lineHeight: 1.05, margin: 0 }}>
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
                    <h3 className="sc-tanker-h3" style={{ margin: '0 0 0.25rem', lineHeight: 1.1 }}>
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
            <h2 className="reveal delay-1 t-h2" style={{ marginBottom: '0.75rem' }}>
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
