import Image from 'next/image';
import { MkSeal } from '@/components/ui/MkSeal';

const FOOTER_LINKS = {
  Services: [
    { href: '/sell-gold',            label: 'Sell Gold' },
    { href: '/release-pledged-gold', label: 'Pledged Gold Release' },
    { href: '/gold-rate-today',      label: 'Gold Rate Today' },
    { href: '/why-mk-gold',          label: 'Why MK Gold' },
  ],
  Company: [
    { href: '/about',        label: 'About Us' },
    { href: '/testimonials', label: 'Reviews' },
    { href: '/contact',      label: 'All Branches' },
    { href: '/blog',         label: 'Blog' },
  ],
  Cities: [
    { href: '/sell-gold-bangalore', label: 'Bangalore' },
    { href: '/sell-gold-mysore',    label: 'Mysore' },
    { href: '/sell-gold-mangalore', label: 'Mangalore' },
    { href: '/sell-gold-davangere', label: 'Davangere' },
  ],
};

const TRUST_BADGES = [
  { label: '11 Years', sub: 'Est. 2014' },
  { label: 'ISO 9001', sub: '2015 Certified' },
  { label: '16 Branches', sub: 'Karnataka' },
  { label: 'XRF Tested', sub: 'German Spectrometer' },
];

export function MkFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mk-footer mk-bg-dark">
      <div className="mk-container">
        <div className="mk-footer__grid">

          {/* Brand column */}
          <div className="mk-footer__brand">
            <a href="/" aria-label="MK Gold — Home">
              <Image
                src="/brand/logo_light_eng.png"
                alt="MK Gold"
                height={44}
                width={198}
                className="mk-footer__logo-img"
              />
            </a>

            <p className="mk-footer__tagline-kn" lang="kn">
              ತಕ್ಷಣ ಹಣ, ಶಾಶ್ವತ ವಿಶ್ವಾಸ
            </p>

            <p className="mk-footer__desc">
              Karnataka&apos;s trusted gold buyer since 2014. 16 branches across Bangalore,
              Mysore, Mangalore and Davangere. Fair rates, XRF purity test, payment in
              45 minutes.
            </p>

            {/* Dual seals */}
            <div className="mk-footer__seals">
              <MkSeal variant="en" size="sm" />
              <MkSeal variant="kn" size="sm" />
            </div>

            {/* Trust badges */}
            <div className="mk-footer__trust">
              {TRUST_BADGES.map((b) => (
                <span key={b.label} className="mk-footer__trust-badge">
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="mk-footer__col">
              <span className="mk-footer__group-title">{group}</span>
              <ul className="mk-footer__links" role="list">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="mk-footer__link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mk-footer__bottom">
          <p className="mk-footer__bottom-text">
            &copy; {year} MK Gold. All rights reserved.&ensp;·&ensp;
            GST Reg.&ensp;·&ensp;ISO 9001:2015 Certified.
          </p>

          <nav className="mk-footer__bottom-links" aria-label="Legal links">
            <a href="/privacy-policy" className="mk-footer__bottom-link">Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="/terms" className="mk-footer__bottom-link">Terms</a>
            <span aria-hidden="true">·</span>
            <a href="mailto:grievance@mkgold.in" className="mk-footer__bottom-link">
              grievance@mkgold.in
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
