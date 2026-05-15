'use client';

import { useEffect, useState } from 'react';

interface Override {
  id:             number;
  rate_24k:       string;
  rate_22k:       string;
  is_manual:      boolean;
  override_until: string | null;
  updated_at:     string;
}

interface LiveRate {
  rate24K: number;
  rate22K: number;
}

const HOURS = [2, 4, 8, 24] as const;

function fmtDateTime(val: string | null): string {
  if (!val) return 'indefinitely';
  return new Date(val).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

export default function GoldRatePage() {
  const [override, setOverride]   = useState<Override | null>(null);
  const [liveRate, setLiveRate]   = useState<LiveRate | null>(null);
  const [hours, setHours]         = useState<number>(24);
  const [rates, setRates]         = useState({ r24: '', r22: '' });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function fetchData() {
    setLoading(true);
    try {
      const [ovRes, liveRes] = await Promise.all([
        fetch('/api/admin/gold-rate'),
        fetch('/api/gold-rate'),
      ]);
      const ovData   = await ovRes.json();
      const liveData = await liveRes.json();
      setOverride(ovData.override ?? null);
      setLiveRate(liveData);
      // Pre-fill inputs from live rate if no override
      if (!ovData.override) {
        setRates({
          r24: String(liveData.rate24K ?? ''),
          r22: String(liveData.rate22K ?? ''),
        });
      } else {
        setRates({
          r24: ovData.override.rate_24k,
          r22: ovData.override.rate_22k,
        });
      }
    } catch {
      setMessage({ type: 'err', text: 'Could not load rate data.' });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  async function handleSet(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/gold-rate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          rate_24k: rates.r24,
          rate_22k: rates.r22,
          hours,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Manual rate override set successfully.' });
        await fetchData();
      } else {
        setMessage({ type: 'err', text: data.error ?? 'Failed to set rate.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/gold-rate', { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'ok', text: 'Override cleared. Showing live MCX rate.' });
        setOverride(null);
        if (liveRate) {
          setRates({
            r24: String(liveRate.rate24K),
            r22: String(liveRate.rate22K),
          });
        }
      } else {
        setMessage({ type: 'err', text: 'Failed to clear override.' });
      }
    } catch {
      setMessage({ type: 'err', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  }

  const isOverrideActive = Boolean(
    override?.is_manual &&
    (!override.override_until || new Date(override.override_until) > new Date())
  );

  return (
    <div className="mk-admin-page">
      <div className="mk-admin-topbar">
        <h1 className="mk-admin-page-title">Gold Rate Override</h1>
      </div>

      <p className="mk-admin-subtitle">
        When set, the homepage and all pages will show this rate instead of the live MCX rate.
      </p>

      {/* Warning banner if override active */}
      {isOverrideActive && (
        <div className="mk-admin-warning-banner">
          Manual rate override is active. Users are seeing your set rate, not the live MCX rate.
          {' '}Override expires at {fmtDateTime(override!.override_until)}.
          {' '}Click &ldquo;Clear Override&rdquo; to restore the live rate.
        </div>
      )}

      {message && (
        <div className={`mk-admin-alert mk-admin-alert--${message.type === 'ok' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Status card */}
      <div className="mk-admin-section">
        <h2 className="mk-admin-section-title">Current Status</h2>
        {loading ? (
          <p className="mk-admin-muted">Loading…</p>
        ) : isOverrideActive ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="mk-admin-rate-row">
                <span className="mk-admin-rate-karat">24K</span>
                <span className="mk-admin-rate-val">₹{Number(override!.rate_24k).toLocaleString('en-IN')}/g</span>
                <span className="mk-admin-rate-karat" style={{ marginLeft: '1.5rem' }}>22K</span>
                <span className="mk-admin-rate-val">₹{Number(override!.rate_22k).toLocaleString('en-IN')}/g</span>
              </div>
              <p className="mk-admin-muted" style={{ marginTop: '0.5rem' }}>
                Expires: {fmtDateTime(override!.override_until)}
              </p>
            </div>
            <button
              className="mk-admin-btn mk-admin-btn--plum"
              onClick={handleClear}
              disabled={saving}
            >
              Clear Override
            </button>
          </div>
        ) : (
          <p style={{ color: '#22a85a', fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 'var(--t-sm)' }}>
            Currently showing live MCX rate.
          </p>
        )}
      </div>

      {/* Override form */}
      <div className="mk-admin-section" style={{ marginTop: 'var(--s-5)' }}>
        <h2 className="mk-admin-section-title">Set Manual Rate</h2>
        <form onSubmit={handleSet} noValidate>
          <div className="mk-admin-form-grid mk-admin-form-grid--2">
            {[
              { label: '24K rate (₹/gram)', key: 'r24' },
              { label: '22K rate (₹/gram)', key: 'r22' },
            ].map(({ label, key }) => (
              <div key={key} className="mk-admin-field">
                <label className="mk-admin-label">{label}</label>
                <input
                  type="number"
                  min="1000"
                  max="20000"
                  step="1"
                  className="mk-admin-input"
                  value={rates[key as keyof typeof rates]}
                  onChange={e => setRates(r => ({ ...r, [key]: e.target.value }))}
                  required
                />
              </div>
            ))}
          </div>

          <div className="mk-admin-field" style={{ maxWidth: '220px', marginTop: 'var(--s-4)' }}>
            <label className="mk-admin-label">Override valid for</label>
            <select
              className="mk-admin-select"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
            >
              {HOURS.map(h => (
                <option key={h} value={h}>{h} hours</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 'var(--s-5)' }}>
            <button
              type="submit"
              className="mk-admin-btn mk-admin-btn--gold"
              disabled={saving}
            >
              {saving ? 'Setting…' : 'Set Manual Rate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
