'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MkNavbar } from '@/components/layout/MkNavbar';
import { MkTicker } from '@/components/layout/MkTicker';
import { MkFooter } from '@/components/layout/MkFooter';
import { MkFaq } from '@/components/sections/MkFaq';
import { MkCtaBand } from '@/components/sections/MkCtaBand';
import { GoldCalculatorUnlocked } from '@/components/sections/GoldCalculatorSection';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';
import { MkLeadPopup } from '@/components/features/MkLeadPopup';
import { BRANCHES, type Branch } from '@/lib/branch-router';
import { getUtmParams } from '@/lib/utm';
import type { FaqItem } from '@/lib/db/faqs';

const CITIES = ['Bangalore', 'Mysore', 'Mangalore', 'Davangere'] as const;
type City = typeof CITIES[number];


/* ─── Callback form ────────────────────────────────────────────── */

function CallbackForm({ onSuccess }: { onSuccess?: () => void }) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', pincode: '', goldType: '', weight: '', purity: '', notes: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError('');

    const cleanPhone = form.phone.replace(/\s/g, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setPhoneError('Enter a valid 10-digit Indian mobile number');
      return;
    }

    const purityKarat = form.purity === '24k' ? 24 : form.purity === '22k' ? 22 : undefined;
    const weightGrams = form.weight === 'under30' ? 20
      : form.weight === 'under50' ? 40
        : form.weight === 'over100' ? 100
          : undefined;

    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: cleanPhone,
          city: form.city || undefined,
          area: form.pincode || undefined,
          gold_type: form.goldType || undefined,
          weight_grams: weightGrams != null ? String(weightGrams) : undefined,
          purity_karat: purityKarat,
          notes: form.notes || undefined,
          source: 'sample-c-callback',
          ...getUtmParams(),
        }),
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
          value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
      </div>
      <div>
        <label className="mk-calc__label">Phone Number</label>
        <input
          type="tel" required className={`mk-input${phoneError ? ' mk-input--error' : ''}`}
          placeholder="10-digit mobile" inputMode="numeric" autoComplete="tel" maxLength={10}
          value={form.phone}
          onChange={e => { const d = e.target.value.replace(/\D/g, '').slice(0, 10); setForm(f => ({ ...f, phone: d })); setPhoneError(''); }}
        />
        {phoneError && (
          <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: '0.72rem', color: '#f87171', margin: '0.25rem 0 0' }}>
            {phoneError}
          </p>
        )}
      </div>
      <div>
        <label className="mk-calc__label">City</label>
        <select required className="mk-select" value={form.city}
          onChange={e => setForm(f => ({ ...f, city: e.target.value, pincode: '' }))}>
          <option value="" disabled>Select your city</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mysore">Mysore</option>
          <option value="Mangalore">Mangalore</option>
          <option value="Davangere">Davangere</option>
        </select>
      </div>
      {form.city === 'Bangalore' && (
        <div>
          <label className="mk-calc__label">Nearest Area / Pincode</label>
          <select className="mk-select" value={form.pincode}
            onChange={e => setForm(f => ({ ...f, pincode: e.target.value }))}>
            <option value="">Select your area (optional)</option>
            <option value="Rajajinagar – 560010">Rajajinagar – 560010</option>
            <option value="Malleshwaram – 560003">Malleshwaram – 560003</option>
            <option value="Vijayanagar – 560040">Vijayanagar – 560040</option>
            <option value="Basaveshwaranagar – 560079">Basaveshwaranagar – 560079</option>
            <option value="Yeshwanthpur – 560022">Yeshwanthpur – 560022</option>
            <option value="Jayanagar – 560041">Jayanagar – 560041</option>
            <option value="Indiranagar – 560038">Indiranagar – 560038</option>
            <option value="Koramangala – 560034">Koramangala – 560034</option>
            <option value="Whitefield – 560066">Whitefield – 560066</option>
            <option value="JP Nagar – 560078">JP Nagar – 560078</option>
          </select>
        </div>
      )}
      <div>
        <label className="mk-calc__label">Gold Type</label>
        <select className="mk-select" required value={form.goldType}
          onChange={e => setForm(f => ({ ...f, goldType: e.target.value }))}>
          <option value="" disabled>Select type</option>
          <option value="jewellery">Gold Jewellery</option>
          <option value="coins">Gold Coins</option>
          <option value="bars">Gold Bars</option>
          <option value="broken">Broken / Damaged Gold</option>
          <option value="pledged">Pledged Gold (bank/NBFC)</option>
        </select>
      </div>
      <div>
        <label className="mk-calc__label">Approx. Weight</label>
        <select className="mk-select" value={form.weight}
          onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}>
          <option value="" disabled>Select weight range</option>
          <option value="under30">Under 30 gms</option>
          <option value="under50">More than 50 gms</option>
          <option value="over100">More than 100 gms</option>
        </select>
      </div>
      <div>
        <label className="mk-calc__label">Gold Purity</label>
        <select className="mk-select" value={form.purity}
          onChange={e => setForm(f => ({ ...f, purity: e.target.value }))}>
          <option value="" disabled>Select purity</option>
          <option value="24k">24K (Pure / Coins)</option>
          <option value="22k">22K (Most common)</option>
          <option value="unknown">Not sure (we test free)</option>
        </select>
      </div>
      <div>
        <label className="mk-calc__label">Message / Notes</label>
        <textarea className="mk-textarea" rows={3} placeholder="Any details about your gold (optional)"
          value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          style={{ resize: 'none' }} />
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let map: any;
    try {
      map = new g.Map(mapDivRef.current, {
        center: { lat: center.lat, lng: center.lng },
        zoom: center.zoom,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || 'DEMO_MAP_ID',
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: 'cooperative',
        clickableIcons: false,
      });
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMapError(true);
      return;
    }

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <p className="mk-section-overline reveal">Branches Across Karnataka</p>
        <h2 className="reveal delay-1 t-h2" style={{ marginBottom: '2.5rem' }}>
          Find Your Nearest MK Gold Branch
        </h2>

        <div className="sc-city-grid reveal delay-2">
          {CITIES.map((city) => {
            const isActive = city === 'Bangalore';
            const count = BRANCHES.filter(b => b.city.toLowerCase() === city.toLowerCase()).length;
            return (
              <button
                key={city}
                onClick={() => { if (isActive) { setActiveCity(city); setActiveBranch(null); } }}
                className={`sc-city-card${activeCity === city ? ' sc-city-card--active' : ''}${!isActive ? ' sc-city-card--coming-soon' : ''}`}
                disabled={!isActive}
                aria-disabled={!isActive}
              >
                <div style={{ width: '100%', maxWidth: '96px', margin: '0 auto', position: 'relative', opacity: isActive ? 1 : 0.4 }}>
                  {cityArt[city]}
                </div>
                <p className="sc-city-name">{city}</p>
                {isActive
                  ? <p className="sc-city-count">{count} {count === 1 ? 'branch' : 'branches'}</p>
                  : <p className="sc-city-count" style={{ color: 'var(--mist)', fontStyle: 'italic' }}>Coming Soon</p>
                }
              </button>
            );
          })}
        </div>

        {/* Map only shown for Bangalore — other cities not yet operational */}
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

const TRUST_BADGES = ['GST Registered', 'ISO 9001:2015', 'XRF Certified' /* , '16 Physical Branches' */] as const; // was: 16 Physical Branches

/* ─── Auto-spinning trust coin ──────────────────────────────────── */

function TrustCoin() {
  const faceStyle: React.CSSProperties = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' };
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
  { n: '01', title: 'Weight Check', body: 'Accurate weight checking systems — your gold weighed on certified precision scales in front of you.', icon: '/weight.png', alt: 'Weight check scale' },
  { n: '02', title: 'Purity Verification', body: 'Using advanced XRF Machine — German spectrometer reads exact gold content in under 2 minutes. No acid test.', icon: '/purity.png', alt: 'XRF purity verification' },
  { n: '03', title: 'Rate Calculation', body: 'Based on live markets — your offer is calculated against live MCX rates. We show our margin openly.', icon: '/rate_calc.png', alt: 'Rate calculation chart' },
  { n: '04', title: 'Payment Transfer', body: 'Instant payment to your bank account — receive cash, NEFT, or UPI within 30 minutes of evaluation.', icon: '/payment.png', alt: 'Instant payment transfer' },
] as const;

function LocalStepsSection() {
  return (
    <section className="section" style={{ backgroundColor: '#fff', paddingTop: 'calc(var(--section) - 25px)' }} id="how-it-works">
      <div className="mk-container">
        <div className="reveal" style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto 3.5rem' }}>
          <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: 'var(--t-h2)', lineHeight: 1.15, marginBottom: '1rem', color: '#512561' }}>
            Our Gold Evaluation Process
          </h2>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 'var(--t-base)', color: '#7B2C91', lineHeight: 1.65 }}>
            We follow a transparent process to ensure you get the best value
          </p>
        </div>
        <ol className="sc-steps-grid" aria-label="Gold evaluation process steps">
          {SC_STEPS.map((step, i) => (
            <li key={step.n} className={`sc-step reveal delay-${i + 1}`}>
              <div className="sc-step__icon-wrap">
                <Image src={step.icon} alt={step.alt} width={80} height={80} className="sc-step__icon" />
              </div>
              <span className="sc-step__number">{step.n}</span>
              <h3 className="sc-step__title">{step.title}</h3>
              <p className="sc-step__body">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* ── Quick-nav CTA bar ──────────────────────────────────── */}
        <nav className="sc-cta-bar" aria-label="Quick navigation">
          <a href="#find-branch" className="sc-cta-bar__link">Find Nearest Branch</a>
          <a href="#gold-rate" className="sc-cta-bar__link">Live Gold Rate</a>
          <Link href="/contact" className="sc-cta-bar__link">Contact Us</Link>
          <Link href="/sell-gold" className="sc-cta-bar__btn">Sell Gold &nbsp;&#9660;</Link>
        </nav>
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
          <Link href="/sell-gold" className="sc-bn-btn sc-bn-btn--primary">
            Sell Gold
          </Link>
          <span className="sc-bn-sep" aria-hidden="true" />
          <a href={`tel:${process.env.NEXT_PUBLIC_PHONE_DEFAULT ?? '+917019500600'}`} className="sc-bn-btn sc-bn-btn--call">
            Call Us
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-bn-btn sc-bn-btn--whatsapp"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
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
  initialBanners?: { src: string | null; alt: string; src_mobile?: string | null }[];
}) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [slide, setSlide] = useState(0);
  const [rateUnlocked, setRateUnlocked] = useState(false);
  const [banners, setBanners] = useState<{ src: string | null; alt: string; src_mobile?: string | null }[]>(initialBanners);
  const [googleReviews, setGoogleReviews] = useState<{ name: string; area: string; rating: number; text: string; initials: string }[]>([]);
  // heroReady: false on first render so banner 0 skips its fade-in (no blank purple flash)
  const [heroReady, setHeroReady] = useState(false);

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
    // Enable hero slide transitions after the first image has had time to paint.
    // Without this, banner-0 starts at opacity:0 and takes 0.9s to fade in,
    // causing a visible blank-purple flash on page load.
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
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
          setBanners(data.banners.map((b: { src: string | null; alt: string; src_mobile?: string | null }) => ({ src: b.src || null, alt: b.alt, src_mobile: b.src_mobile ?? null })));
        }
      })
      .catch(() => { /* keep current banners */ });
  }, [initialBanners.length]);

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

  // Split into two independent image pools — no shared slide state between them
  const desktopBanners = banners.filter(b => !!b.src);
  const mobileBanners = banners.filter(b => !!b.src_mobile);
  // Cycle count = whichever pool is larger (the smaller wraps around)
  const slideCount = Math.max(desktopBanners.length, mobileBanners.length, 1);

  // Auto-advance banner every 5 seconds
  useEffect(() => {
    if (slideCount < 2) return;
    const id = setInterval(() => setSlide(p => (p + 1) % slideCount), 5000);
    return () => clearInterval(id);
  }, [slideCount]);


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
        {/* ── Desktop banners — tablet & desktop only, never shown on phones ── */}
        {desktopBanners.map((b, i) => {
          const dSlide = slide % Math.max(desktopBanners.length, 1);
          const isActive = i === dSlide;
          return (
            <Image
              key={`desktop-${b.src}-${i}`}
              src={b.src!}
              alt={b.alt}
              fill
              sizes="100vw"
              quality={85}
              priority={i === 0}
              className={[
                'sc-hero__banner',
                'sc-hero__banner--desktop',
                isActive ? (heroReady ? 'sc-hero__banner--active' : 'sc-hero__banner--first-active') : '',
              ].filter(Boolean).join(' ')}
              aria-hidden={!isActive}
              draggable={false}
              style={{ objectFit: 'cover' }}
            />
          );
        })}

        {/* ── Mobile banners — phones only, never shown on tablet/desktop ── */}
        {mobileBanners.map((b, i) => {
          const mSlide = slide % Math.max(mobileBanners.length, 1);
          const isActive = i === mSlide;
          return (
            <Image
              key={`mobile-${b.src_mobile}-${i}`}
              src={b.src_mobile!}
              alt={b.alt}
              fill
              sizes="100vw"
              quality={85}
              priority={i === 0}
              className={[
                'sc-hero__banner',
                'sc-hero__banner--mobile',
                isActive ? (heroReady ? 'sc-hero__banner--active' : 'sc-hero__banner--first-active') : '',
              ].filter(Boolean).join(' ')}
              aria-hidden={!isActive}
              draggable={false}
              style={{ objectFit: 'cover' }}
            />
          );
        })}
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
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="en" size="lg" />
                </div>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' as const, transform: 'rotateY(180deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MkSeal variant="kn" size="lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* ── Tagline + how-it-works — single white block, no gap possible ── */}
      <div style={{ position: 'relative', zIndex: 4, backgroundColor: '#fff' }}>
        <div className="sc-tagline-bridge" aria-hidden="true">
          <div className="sc-tagline-card">
            {/* Trapezoid with 7px bezier curves at both top corners — no sharp points */}
            <svg className="sc-tagline-card__bg" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M 115 0 L 885 0 Q 900 0 910.6 10.6 L 1000 100 L 0 100 L 89.4 10.6 Q 100 0 115 0 Z" fill="#fff" />
            </svg>
            <span className="sc-tagline-card__text">Instant Money. Lasting Trust.</span>
          </div>
        </div>
        <LocalStepsSection />
      </div>

      {/* ── Step divider: gallery cap left 35%, slant 35→37%, rounded corner ── */}
      <svg
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '25px', marginBottom: '-25px', position: 'relative', zIndex: 2, pointerEvents: 'none' }}
        viewBox="0 0 1000 25"
        preserveAspectRatio="none"
      >
        {/* Shape: gallery colour covers 0→37%, slants to 35% bottom, rounded corner, back to 0 */}
        <path d="M 0 0 L 370 0 L 354.4 19.5 Q 350 25 343 25 L 0 25 Z" fill="#FFFFFF" />
      </svg>

      {/* ── Rate section — continuous dark bg ──────────────────── */}
      <div className="mk-bg-dark sc-no-gap">

        {/* ── Rate + Calculator + Callback + Chart ────────────────── */}
        <section className="sc-rate-section section" id="gold-rate">
          <div className="mk-container" style={{ position: 'relative' }}>
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
                    <h3 className="sc-tanker-h3" style={{ margin: '0 0 0.25rem', lineHeight: 1.1, color: 'var(--plum)' }}>
                      Calculate Your Gold Value
                    </h3>
                    <p className="sc-gate-subtitle">Enter your details to unlock the live calculator</p>
                  </div>
                  <CallbackForm onSuccess={() => setRateUnlocked(true)} />
                  <p className="sc-gate-privacy">Your details are safe &amp; never shared.</p>
                </div>
              </div>
            )}

            {/* Unlocked state — pixel-perfect calculator with Gold.png */}
            {rateUnlocked && (
              <GoldCalculatorUnlocked />
            )}

            {/* ── Quick-nav CTA bar (repeated at bottom of rate section) ── */}
            <nav className="sc-cta-bar sc-cta-bar--dark" aria-label="Quick navigation">
              <a href="#find-branch" className="sc-cta-bar__link">Find Nearest Branch</a>
              <a href="#gold-rate" className="sc-cta-bar__link">Live Gold Rate</a>
              <Link href="/contact" className="sc-cta-bar__link">Contact Us</Link>
              <Link href="/sell-gold" className="sc-cta-bar__btn">Sell Gold &nbsp;&#9660;</Link>
            </nav>
          </div>
        </section>
      </div>{/* end continuous dark: StatBand + Rate */}

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
