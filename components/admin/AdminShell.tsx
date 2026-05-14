'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const NAV = [
  { href: '/admin',            label: 'Dashboard', exact: true },
  { href: '/admin/gold-rate',  label: 'Gold Rate' },
  { href: '/admin/banners',    label: 'Banners' },
  { href: '/admin/blog',       label: 'Blog' },
  { href: '/admin/leads',      label: 'Leads' },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen] = useState(false);

  // Login page: render bare — no sidebar
  if (pathname === '/admin/login') return <>{children}</>;

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="mk-admin-shell">
      {/* Mobile hamburger */}
      <button
        className="mk-admin-hamburger"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span className={`mk-admin-ham-bar${open ? ' mk-admin-ham-bar--top-open' : ''}`} />
        <span className={`mk-admin-ham-bar${open ? ' mk-admin-ham-bar--mid-open' : ''}`} />
        <span className={`mk-admin-ham-bar${open ? ' mk-admin-ham-bar--bot-open' : ''}`} />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="mk-admin-overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`mk-admin-sidebar${open ? ' mk-admin-sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="mk-admin-sidebar__logo">
          <Link href="/admin" onClick={() => setOpen(false)} style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Tanker, serif', fontSize: '1.4rem', lineHeight: 1, letterSpacing: '0.01em' }}>
              <span style={{ color: 'var(--gold)' }}>MK</span>
              <span style={{ color: 'var(--white)', letterSpacing: '0.07em' }}> GOLD</span>
            </div>
            <div style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '0.48rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '4px',
            }}>
              Admin Panel
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="mk-admin-nav" aria-label="Admin navigation">
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`mk-admin-nav__link${isActive(item.href, item.exact) ? ' mk-admin-nav__link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom: view site + sign out */}
        <div className="mk-admin-sidebar__bottom">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mk-admin-sidebar__site-link"
          >
            View Site
          </a>
          <button className="mk-admin-sidebar__logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="mk-admin-main">
        {children}
      </main>
    </div>
  );
}
