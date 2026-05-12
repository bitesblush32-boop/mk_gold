'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MkButton } from '@/components/ui/MkButton';
import { cn } from '@/lib/utils';

/* ─── Services dropdown items ─────────────────────────────────── */
const SERVICES_LINKS = [
  { href: '/sell-gold',              label: 'Sell Gold' },
  { href: '/sell-gold-for-cash',     label: 'Sell Gold for Cash' },
  { href: '/release-pledged-gold',   label: 'Release Pledged Gold' },
  { href: '/exchange-gold-for-cash', label: 'Exchange Gold for Cash' },
  { href: '/sell-old-gold',          label: 'Sell Old Gold' },
  { href: '/sell-gold-jewellery',    label: 'Sell Gold Jewellery' },
  { href: '/sell-gold-coins',        label: 'Sell Gold Coins' },
  { href: '/sell-gold-bars',         label: 'Sell Gold Bars' },
  { href: '/sell-gold-by-purity',    label: 'Sell Gold by Purity' },
  { href: '/sell-gold#calculator',   label: 'Sell Gold Calculator' },
];

/* ─── Regular nav links ───────────────────────────────────────── */
const NAV_LINKS = [
  { href: '/gold-rate-today', label: 'Gold Rate' },
  { href: '/about',           label: 'About' },
  { href: '/contact',         label: 'Branches' },
  { href: '/blog',            label: 'Blog' },
];

export function MkNavbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const lastScrollY = useRef(0);
  const servicesRef = useRef<HTMLLIElement>(null);

  // Hide on scroll down, show on scroll up — passive listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 60) {
        setHidden(false);
      } else if (y > lastScrollY.current + 4) {
        setHidden(true);
        setMenuOpen(false);
        setServicesOpen(false);
      } else if (y < lastScrollY.current - 4) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close services dropdown on click outside or Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setServicesOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const servicesActive = SERVICES_LINKS.some(
    (l) => pathname === l.href || pathname.startsWith(l.href.split('#')[0] + '/')
  );
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? '918000000000'}`;
  const callHref = `tel:+${process.env.NEXT_PUBLIC_PHONE_DEFAULT ?? '918000000000'}`;

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

          {/* Desktop nav */}
          <ul className="mk-navbar__nav" role="list">

            {/* Services dropdown */}
            <li ref={servicesRef} className="mk-nav-item--dropdown">
              <button
                className={cn(
                  'mk-navbar__link mk-nav-dropdown__trigger',
                  servicesActive && 'mk-navbar__link--active'
                )}
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((v) => !v)}
              >
                Services
                <span className="mk-nav-dropdown__chevron" aria-hidden="true" />
              </button>

              <ul
                className={cn('mk-nav-dropdown__panel', servicesOpen && 'mk-nav-dropdown__panel--open')}
                role="menu"
              >
                {SERVICES_LINKS.map((item) => (
                  <li key={item.href} role="none">
                    <a
                      href={item.href}
                      className={cn(
                        'mk-nav-dropdown__item',
                        pathname === item.href && 'mk-nav-dropdown__item--active'
                      )}
                      role="menuitem"
                      onClick={() => setServicesOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </li>

            {/* Regular links */}
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

            <div className="mk-navbar__extra-ctas">
              <MkButton variant="whatsapp" size="sm" href={whatsappHref} external>
                WhatsApp
              </MkButton>
              <MkButton variant="outline-light" size="sm" href={callHref}>
                Call Us
              </MkButton>
            </div>

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

          {/* Services — expandable submenu on mobile */}
          <li>
            <button
              className="mk-navbar__link mk-mobile-services__toggle"
              onClick={() => setMobileServicesOpen((v) => !v)}
              aria-expanded={mobileServicesOpen}
              tabIndex={menuOpen ? 0 : -1}
            >
              Services
              <span
                className={cn(
                  'mk-nav-dropdown__chevron',
                  mobileServicesOpen && 'mk-nav-dropdown__chevron--up'
                )}
                aria-hidden="true"
              />
            </button>

            {mobileServicesOpen && (
              <ul className="mk-mobile-services__items" role="list">
                {SERVICES_LINKS.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="mk-mobile-services__item"
                      tabIndex={menuOpen ? 0 : -1}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>

          {/* Regular links */}
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
          <MkButton
            variant="outline-light"
            href={callHref}
            style={{ width: '100%' }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Call Us
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
