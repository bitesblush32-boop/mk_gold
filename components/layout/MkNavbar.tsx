'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MkButton } from '@/components/ui/MkButton';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/sell-gold',            label: 'Sell Gold' },
  { href: '/release-pledged-gold', label: 'Pledged Gold' },
  { href: '/gold-rate-today',      label: 'Gold Rate' },
  { href: '/about',                label: 'About' },
  { href: '/contact',              label: 'Branches' },
];

export function MkNavbar() {
  const pathname   = usePathname();
  const [hidden, setHidden]   = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up — passive listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) {
        setHidden(false);
      } else if (y > lastScrollY.current + 4) {
        setHidden(true);
        setMenuOpen(false);
      } else if (y < lastScrollY.current - 4) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? '918000000000'}`;

  return (
    <>
      <nav
        className={cn('mk-navbar', hidden && 'mk-navbar--hidden')}
        aria-label="Main navigation"
      >
        <div className="mk-navbar__inner" style={{ maxWidth: '100%' }}>
          <a href="/" className="mk-navbar__logo-link" aria-label="MK Gold — Home">
            <Image
              src="/brand/logo_light_eng.png"
              alt="MK Gold — Instant Money, Lasting Trust"
              height={56}
              width={253}
              priority
              className="mk-navbar__logo-img"
              style={{ height: '56px', width: 'auto' }}
            />
          </a>

          {/* Desktop links */}
          <ul className="mk-navbar__nav" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    'mk-navbar__link',
                    pathname === link.href && 'mk-navbar__link--active'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mk-navbar__actions">
            <MkButton variant="gold" size="sm" href="/sell-gold">
              Sell Gold Today
            </MkButton>

            {/* Hamburger */}
            <button
              className={cn('mk-hamburger', menuOpen && 'mk-hamburger--open')}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mk-mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="mk-hamburger__bar" />
              <span className="mk-hamburger__bar" />
              <span className="mk-hamburger__bar" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        id="mk-mobile-menu"
        className={cn('mk-mobile-menu', menuOpen && 'mk-mobile-menu--open')}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
      >
        <ul role="list" className="mk-mobile-menu__links">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  'mk-navbar__link',
                  pathname === link.href && 'mk-navbar__link--active'
                )}
                tabIndex={menuOpen ? 0 : -1}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="mk-mobile-menu__ctas">
          <MkButton
            variant="gold"
            href="/sell-gold"
            style={{ width: '100%' }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Sell Gold Today
          </MkButton>
          <MkButton
            variant="whatsapp"
            href={whatsappHref}
            external
            style={{ width: '100%' }}
            tabIndex={menuOpen ? 0 : -1}
          >
            WhatsApp Us
          </MkButton>
        </div>
      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="mk-mobile-menu__backdrop"
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
