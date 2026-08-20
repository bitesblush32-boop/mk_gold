"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { MkButton } from "@/components/ui/MkButton";
import { cn } from "@/lib/utils";

// Pre-computed Ashoka Chakra spokes — rounded to 4dp to prevent SSR/client
// floating-point mismatch between Node.js and browser V8 trig precision
const r4 = (n: number) => Math.round(n * 10000) / 10000;
const CHAKRA_SPOKES = Array.from({ length: 24 }, (_, i) => {
  const a = (i * Math.PI * 2) / 24;
  return {
    x1: r4(20 + 3 * Math.cos(a)),
    y1: r4(20 + 3 * Math.sin(a)),
    x2: r4(20 + 15 * Math.cos(a)),
    y2: r4(20 + 15 * Math.sin(a)),
  };
});

/* ─── Services dropdown items ─────────────────────────────────── */
const SERVICES_LINKS = [
  { href: "/sell-gold", label: "Sell Gold" },
  { href: "/release-pledged-gold", label: "Release Pledged Gold" },
  { href: "/gold-rate-today", label: "Gold Rate Today" },
  { href: "/sell-gold#calculator", label: "Gold Calculator" },
];

/* ─── Regular nav links ───────────────────────────────────────── */
const NAV_LINKS = [
  { href: "/gold-rate-today", label: "Gold Rate" },
  { href: "/about", label: "About" },
  // { href: '/contact', label: 'Branches' }, // TODO: restore when all branches are live
  { href: "/#faq", label: "FAQ" },
  { href: "/blog", label: "Blog" },
];

export function MkNavbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const lastScrollY = useRef(0);
  const servicesRef = useRef<HTMLLIElement>(null);
  const suppressHoverRef = useRef(false);

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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setMobileServicesOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close services dropdown on click outside or Escape
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (
        servicesRef.current &&
        !servicesRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false);
      }
    };
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  // Tiranga theme — active Aug 1–31
  const isTiranga = new Date().getMonth() === 7;
  const independenceEdition = new Date().getFullYear() - 1947 + 1;

  const servicesActive = SERVICES_LINKS.some(
    (l) =>
      pathname === l.href || pathname.startsWith(l.href.split("#")[0] + "/"),
  );
  const whatsappHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? "917019500600"}`;
  const callHref = `tel:${process.env.NEXT_PUBLIC_PHONE_DEFAULT ?? "+917019500600"}`;

  return (
    <>
      <nav
        className={cn("mk-navbar", hidden && "mk-navbar--hidden")}
        aria-label="Main navigation"
      >
        {/* 3 — Ashoka Chakra watermark: centered behind nav content, Aug only */}
        {isTiranga && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "88px",
              height: "88px",
              opacity: 0.045,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <svg viewBox="0 0 40 40" width="88" height="88">
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <circle cx="20" cy="20" r="2.5" fill="#FFFFFF" />
              {CHAKRA_SPOKES.map((s, i) => (
                <line
                  key={i}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              ))}
            </svg>
          </div>
        )}

        {/* Logo — outside the inner pill */}
        <Link
          href="/"
          className="mk-navbar__logo-link"
          aria-label="MK Gold — Home"
        >
          <Image
            src="/brand/logo_light_eng.png"
            alt="MK Gold — Instant Money, Lasting Trust"
            height={56}
            width={253}
            priority
            className="mk-navbar__logo-img"
            style={{ height: "56px", width: "auto" }}
          />
        </Link>

        {/* 9 — Pinhole tricolor dots next to logo, Aug only — hidden on mobile */}
        {isTiranga && (
          <div
            aria-hidden="true"
            className="mk-navbar__tiranga-dots"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "3px",
              alignSelf: "center",
              flexShrink: 0,
              marginLeft: "-8px",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#FF9933",
                display: "block",
              }}
            />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.88)",
                display: "block",
              }}
            />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#138808",
                display: "block",
              }}
            />
          </div>
        )}

        {/* 7 — Independence Day edition chip, Aug only — hidden on mobile */}
        {isTiranga && (
          <div
            aria-hidden="true"
            className="mk-navbar__tiranga-chip"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "0.58rem",
              fontWeight: 600,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.65)",
              background: "rgba(255,153,51,0.12)",
              border: "1px solid rgba(255,153,51,0.28)",
              borderRadius: "9999px",
              padding: "0.18rem 0.6rem",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {independenceEdition}th Independence Day
          </div>
        )}

        {/* Inner pill — nav links + actions only */}
        <div className="mk-navbar__inner" style={{ maxWidth: "100%" }}>
          {/* Desktop nav */}
          <ul className="mk-navbar__nav" role="list">
            {/* Services dropdown */}
            <li
              ref={servicesRef}
              className="mk-nav-item--dropdown"
              onMouseEnter={() => {
                if (!suppressHoverRef.current) setServicesOpen(true);
              }}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={cn(
                  "mk-navbar__link mk-nav-dropdown__trigger",
                  servicesActive && "mk-navbar__link--active",
                )}
                aria-haspopup="true"
                aria-expanded={servicesOpen}
                onClick={() => {
                  const wasOpen = servicesOpen;
                  setServicesOpen(!wasOpen);
                  if (wasOpen) {
                    suppressHoverRef.current = true;
                    setTimeout(() => {
                      suppressHoverRef.current = false;
                    }, 300);
                  }
                }}
              >
                Services
                <span className="mk-nav-dropdown__chevron" aria-hidden="true" />
              </button>

              {/* Invisible hover bridge — keeps the dropdown open while the
                  cursor travels through the visual gap between the trigger
                  and the panel below it. */}
              <div className="mk-nav-dropdown__bridge" aria-hidden="true" />

              <ul
                className={cn(
                  "mk-nav-dropdown__panel",
                  servicesOpen && "mk-nav-dropdown__panel--open",
                )}
                role="menu"
              >
                {SERVICES_LINKS.map((item) => (
                  <li key={item.href} role="none">
                    <a
                      href={item.href}
                      className={cn(
                        "mk-nav-dropdown__item",
                        pathname === item.href &&
                          "mk-nav-dropdown__item--active",
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
                    "mk-navbar__link",
                    pathname === link.href && "mk-navbar__link--active",
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
              <MkButton
                variant="whatsapp"
                size="sm"
                href={whatsappHref}
                external
              >
                WhatsApp
              </MkButton>
              <MkButton variant="outline-light" size="sm" href={callHref}>
                Call Us
              </MkButton>
            </div>

            {/* Hamburger */}
            <button
              className={cn("mk-hamburger", menuOpen && "mk-hamburger--open")}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
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

        {/* Mobile-only chip — sits below nav bar, centered, doesn't affect flex layout */}
        {isTiranga && (
          <div aria-hidden="true" className="mk-navbar__tiranga-chip--mobile">
            {independenceEdition}th Independence Day
          </div>
        )}
      </nav>

      {/* Mobile overlay */}
      <div
        id="mk-mobile-menu"
        className={cn("mk-mobile-menu", menuOpen && "mk-mobile-menu--open")}
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
                  "mk-nav-dropdown__chevron",
                  mobileServicesOpen && "mk-nav-dropdown__chevron--up",
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
                  "mk-navbar__link",
                  pathname === link.href && "mk-navbar__link--active",
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
            style={{ width: "100%" }}
            tabIndex={menuOpen ? 0 : -1}
          >
            Sell Gold Today
          </MkButton>
          <MkButton
            variant="whatsapp"
            href={whatsappHref}
            external
            style={{ width: "100%" }}
            tabIndex={menuOpen ? 0 : -1}
          >
            WhatsApp Us
          </MkButton>
          <MkButton
            variant="outline-light"
            href={callHref}
            style={{ width: "100%" }}
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
