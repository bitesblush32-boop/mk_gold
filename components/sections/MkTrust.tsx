// N12 — Trust section: 8-layer trust architecture

import { MkSeal } from '@/components/ui/MkSeal';

/* ─── Data ────────────────────────────────────────────────────── */

const PILLARS = [
  {
    label: 'ISO 9001:2015 Certified',
    detail: 'Quality management certified. Every process — weighing, testing, payment — is audited and documented.',
  },
  {
    label: 'German XRF Spectrometer',
    detail: 'We use a Bruker S1 Titan XRF spectrometer. It reads exact gold content. No acid. No guesswork.',
  },
  {
    label: 'Live MCX Rate Transparency',
    detail: 'Our buying rate is displayed beside the MCX rate so you can see exactly what we earn. Nothing hidden.',
  },
  {
    label: 'Est. 2014 — 15+ Years',
    detail: '10,000+ transactions across Karnataka. A business built on repeat customers and word-of-mouth alone.',
  },
  {
    label: 'Confidential Service',
    detail: 'Private consultation rooms. Discreet transactions. Your decision to sell gold is yours — we never judge.',
  },
  {
    label: 'Post-Sale Support',
    detail: 'WhatsApp support after your transaction. Grievance email in footer. We stand behind every offer we make.',
  },
] as const;

const TRUST_BADGES = [
  'GST Registered',
  'ISO 9001:2015',
  'XRF Certified',
  '16 Physical Branches',
] as const;

/* ─── Component ───────────────────────────────────────────────── */

export function MkTrust() {
  return (
    <section className="mk-trust mk-bg-dark section" id="why-mk-gold">
      <div className="mk-container mk-trust__inner">

        {/* Left column — seal + headline + badges */}
        <div className="mk-trust__left">
          <div className="mk-trust__seals reveal">
            <MkSeal variant="en" size="lg" animate />
            <MkSeal variant="kn" size="lg" />
          </div>

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
          </div>

          {/* Badge row */}
          <div className="mk-trust__badges reveal delay-2" aria-label="Certifications">
            {TRUST_BADGES.map((b) => (
              <span key={b} className="mk-trust__badge">{b}</span>
            ))}
          </div>
        </div>

        {/* Right column — trust pillars */}
        <ul className="mk-trust__pillars" aria-label="Trust pillars">
          {PILLARS.map((p, i) => (
            <li
              key={p.label}
              className={`mk-trust__pillar reveal delay-${(i % 3) + 1}`}
            >
              <strong className="mk-trust__pillar-label">{p.label}</strong>
              <p className="mk-trust__pillar-detail">{p.detail}</p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
