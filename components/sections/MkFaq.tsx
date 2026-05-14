'use client';

// F14 — FAQ accordion with FAQPage schema

import { useState, useRef } from 'react';

/* ─── Data ────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: 'How is gold purity tested at MK Gold?',
    a: 'We use a Bruker S1 Titan XRF (X-Ray Fluorescence) spectrometer — a German instrument used by jewellers and refineries worldwide. It reads the exact elemental composition of your gold in under 2 minutes without any acid, scratching, or damage to your jewellery.',
  },
  {
    q: 'What types of gold do you buy?',
    a: 'We buy gold jewellery (any design, any age), gold coins, gold bars, and broken or damaged gold pieces. We accept 18K, 20K, 22K, and 24K gold. We do not accept gold-plated items or gold-filled jewellery.',
  },
  {
    q: 'How is the buying rate calculated?',
    a: 'Our rate is based on live MCX (Multi Commodity Exchange) gold prices, updated every 5 minutes. We pay 97.5% of the MCX rate — our 2.5% margin is shown openly next to the MCX rate so you can verify it yourself.',
  },
  {
    q: 'How long does the entire process take?',
    a: 'From the moment you walk in to receiving payment, the process takes around 30 minutes for most customers. Weighing takes 5 minutes, XRF testing takes 2 minutes, and payment is immediate once you accept the offer.',
  },
  {
    q: 'What documents do I need to bring?',
    a: 'You need any one valid government-issued photo ID: Aadhaar card, PAN card, Passport, Voter ID, or Driving Licence. No original purchase receipts or hallmark certificates are required.',
  },
  {
    q: 'Can you help release gold pledged at a bank or NBFC?',
    a: 'Yes. We pay the outstanding loan amount directly to your bank or NBFC in front of you, and you receive the balance amount. We handle the full paperwork. Your privacy is protected throughout the process.',
  },
  {
    q: 'Do I need an appointment or can I walk in?',
    a: 'Walk-ins are welcome at all 16 branches during working hours (Monday to Saturday, 9:30 AM to 7:00 PM). Booking an appointment ensures you are attended to immediately, but it is never required.',
  },
] as const;

/* ─── JSON-LD schema ──────────────────────────────────────────── */

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkFaq({ variant = 'home' }: { variant?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    const count = FAQS.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); triggerRefs.current[(i + 1) % count]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); triggerRefs.current[(i - 1 + count) % count]?.focus(); }
    if (e.key === 'Home')      { e.preventDefault(); triggerRefs.current[0]?.focus(); }
    if (e.key === 'End')       { e.preventDefault(); triggerRefs.current[count - 1]?.focus(); }
  }

  return (
    <section className="mk-faq mk-bg-light section" id="faq">
      {/* FAQPage schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <div className="mk-container">
        <div className="mk-faq__header reveal">
          <p className="mk-section-overline">FAQ</p>
          <h2 className="mk-faq__title">Questions we hear every day</h2>
        </div>

        <dl
          className="mk-faq__list"
          role="group"
          aria-label="Frequently asked questions"
        >
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`mk-faq__item${isOpen ? ' mk-faq__item--open' : ''}`}
              >
                <dt>
                  <button
                    ref={el => { triggerRefs.current[i] = el; }}
                    className="mk-faq__trigger"
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-q-${i}`}
                  >
                    <span className="mk-faq__question">{item.q}</span>
                    <span className="mk-faq__icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="mk-faq__answer"
                  hidden={!isOpen}
                >
                  <p className="mk-faq__answer-text">{item.a}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
