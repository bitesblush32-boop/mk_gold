'use client';
// N03 — Lead capture popup (2s delay · session storage · portal)

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MkSeal } from '@/components/ui/MkSeal';
import { MkButton } from '@/components/ui/MkButton';

export function MkLeadPopup() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', goldType: '', weight: '', purity: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('mk_popup_dismissed')) return;
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    setOpen(false);
    sessionStorage.setItem('mk_popup_dismissed', '1');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'popup-lead-form' }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  if (!mounted || !open) return null;

  const popup = (
    <>
      <div
        aria-hidden="true"
        onClick={dismiss}
        style={{
          position: 'fixed', inset: 0, zIndex: 500,
          background: 'rgba(28,10,36,0.72)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          animation: 'lp-fadeIn 300ms ease both',
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get a free gold evaluation"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          zIndex: 501,
          width: 'min(520px, calc(100vw - 2rem))',
          maxHeight: 'calc(100svh - 4rem)',
          overflowY: 'auto',
          borderRadius: 'var(--r-2xl)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(223,193,96,0.2)',
          animation: 'lp-popupSlideIn 350ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        }}
      >
        {/* Header */}
        <div style={{ background: 'var(--plum-deep)', padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <span style={{
              display: 'inline-block',
              background: 'var(--gold)', color: 'var(--plum)',
              fontFamily: 'Poppins, sans-serif', fontSize: '0.65rem', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '0.25rem 0.75rem', borderRadius: '9999px',
            }}>Free Evaluation</span>
            <button
              onClick={dismiss}
              aria-label="Close"
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)', border: 'none',
                color: 'white', cursor: 'pointer', flexShrink: 0,
                fontFamily: 'Poppins, sans-serif', fontSize: '1.125rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >×</button>
          </div>
          <h2 style={{
            fontFamily: 'Tanker, serif', fontSize: '1.75rem', color: 'white',
            textAlign: 'center', lineHeight: 1.2, marginBottom: '0.625rem', marginTop: 0,
          }}>
            Get the{' '}<span style={{ color: 'var(--gold)' }}>Best Price</span>{' '}for Your Gold
          </h2>
          <p style={{
            fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)',
            color: 'rgba(255,255,255,0.65)', textAlign: 'center', margin: 0,
          }}>
            Fill in your details — we&apos;ll call you back within 30 minutes.
          </p>
        </div>

        {/* Body */}
        <div style={{ background: 'white', padding: '2rem' }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <MkSeal variant="en" size="sm" />
              </div>
              <h3 style={{
                fontFamily: 'Tanker, serif', fontSize: '1.5rem',
                color: 'var(--gold)', marginBottom: '0.75rem', marginTop: 0,
              }}>We&apos;ll call you shortly.</h3>
              <p style={{
                fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-sm)',
                color: 'var(--ink-mid)', marginBottom: '1.5rem',
              }}>
                Our team will reach out within 30 minutes during branch hours (9:30 AM – 7:00 PM).
              </p>
              <MkButton variant="outline-plum" onClick={dismiss}>Close</MkButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="lp-form-grid">
                <div>
                  <label className="lp-form-label">Full Name</label>
                  <input type="text" className="mk-input" placeholder="Your name" required
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="lp-form-label">Phone Number</label>
                  <input type="tel" className="mk-input" placeholder="+91 98765 43210" required
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div>
                  <label className="lp-form-label">Gold Type</label>
                  <select className="mk-select" required
                    value={form.goldType} onChange={e => setForm(f => ({ ...f, goldType: e.target.value }))}>
                    <option value="" disabled>Select type</option>
                    <option value="jewellery">Gold Jewellery</option>
                    <option value="coins">Gold Coins</option>
                    <option value="bars">Gold Bars</option>
                    <option value="broken">Broken / Damaged Gold</option>
                    <option value="pledged">Pledged Gold (bank/NBFC)</option>
                  </select>
                </div>
                <div>
                  <label className="lp-form-label">Approx. Weight (grams)</label>
                  <input type="number" className="mk-input" placeholder="e.g. 20" min="1"
                    value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
                </div>
                <div>
                  <label className="lp-form-label">Gold Purity</label>
                  <select className="mk-select"
                    value={form.purity} onChange={e => setForm(f => ({ ...f, purity: e.target.value }))}>
                    <option value="" disabled>Select purity</option>
                    <option value="24k">24K (Pure / Coins)</option>
                    <option value="22k">22K (Most common)</option>
                    <option value="20k">20K</option>
                    <option value="18k">18K</option>
                    <option value="unknown">Not sure (we test free)</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <label className="lp-form-label">Message / Notes</label>
                <textarea className="mk-textarea" rows={3}
                  placeholder="Any details about your gold (optional)"
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="mk-btn mk-btn--gold"
                style={{
                  width: '100%', marginTop: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', padding: '0.875rem 1.5rem',
                  opacity: status === 'loading' ? 0.7 : 1,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                }}
              >
                {status === 'loading' ? 'Sending...' : 'Get My Free Quote Now'}
              </button>
              {status === 'error' && (
                <p style={{
                  textAlign: 'center', color: '#dc2626',
                  fontFamily: 'Poppins, sans-serif', fontSize: 'var(--t-xs)', marginTop: '0.5rem',
                }}>
                  Something went wrong. Please try again.
                </p>
              )}
              <p style={{
                textAlign: 'center', fontFamily: 'Poppins, sans-serif',
                fontSize: 'var(--t-xs)', color: 'var(--mist)', marginTop: '0.75rem',
              }}>
                No spam. No pressure. We call once.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(popup, document.body);
}
