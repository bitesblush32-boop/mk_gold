'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router   = useRouter();
  const [pw, setPw]       = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setErr('Incorrect password');
      }
    } catch {
      setErr('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mk-admin-login-bg">
      <div className="mk-admin-login-card">
        {/* Wordmark */}
        <div className="mk-admin-login-logo">
          <span style={{ color: 'var(--gold)', fontFamily: 'Tanker, serif', fontSize: '2rem', lineHeight: 1 }}>MK</span>
          <span style={{ color: 'var(--white)', fontFamily: 'Tanker, serif', fontSize: '2rem', lineHeight: 1, letterSpacing: '0.07em' }}> GOLD</span>
        </div>

        <h1 className="mk-admin-login-heading">Admin Access</h1>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="Password"
            className="mk-admin-login-input"
            autoComplete="current-password"
            autoFocus
            required
          />

          {err && (
            <p className="mk-admin-login-error">{err}</p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mk-admin-login-btn"
          >
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
