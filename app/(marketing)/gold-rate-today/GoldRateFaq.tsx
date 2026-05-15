'use client';
import type { FaqItem } from '@/lib/db/faqs';

import { useState, useRef } from 'react';

/* ─── Data ──────────────────────────────────────────────────────── */

const FALLBACK_FAQS: FaqItem[] = [
  {
    q: 'What is the MCX gold rate?',
    a: 'MCX (Multi Commodity Exchange of India) is the regulated exchange where gold is traded in futures contracts. The MCX gold rate is the benchmark price in Indian Rupees per 10 grams for 24K (999 purity) gold. It updates continuously during market hours (9:00 AM to 11:30 PM on trading days) and is the most trusted reference point for gold pricing in India.',
  },
  {
    q: 'How often does MK Gold update its rate?',
    a: 'Our rate is refreshed automatically every 5 minutes from the live MCX feed. The rate shown on this page is never more than 5 minutes old. At our branches, the buying rate is updated throughout the day in line with MCX movement — so the rate you see online closely matches what you will receive when you walk in.',
  },
  {
    q: 'Is the rate different for 22K vs 24K gold?',
    a: 'Yes. The base MCX rate is always for 24K (pure) gold. For other purities, the rate is calculated by multiplying by the purity factor: 22K = 91.67%, 20K = 83.33%, 18K = 75.00%. Our Bruker XRF spectrometer tests the exact elemental purity of your gold — not the hallmark stamp — so you are always paid for what you actually have, not what is printed on the jewellery.',
  },
  {
    q: 'Can I lock in today\'s rate?',
    a: 'Gold rates are live and fluctuate during market hours. We are unable to lock a rate in advance. However, once you visit a branch and accept our offer, the agreed rate is binding and payment is made immediately. If the rate moves between the time you check online and when you arrive, the branch will quote based on the live MCX rate at that moment — both rates are shown to you openly.',
  },
];

/* ─── Schema ─────────────────────────────────────────────────────── */



/* ─── Component ─────────────────────────────────────────────────── */

export function GoldRateFaq({ faqs }: { faqs?: FaqItem[] }) {
  const items = faqs && faqs.length > 0 ? faqs : FALLBACK_FAQS;
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const [open, setOpen] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    const count = items.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); triggerRefs.current[(i + 1) % count]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); triggerRefs.current[(i - 1 + count) % count]?.focus(); }
    if (e.key === 'Home')      { e.preventDefault(); triggerRefs.current[0]?.focus(); }
    if (e.key === 'End')       { e.preventDefault(); triggerRefs.current[count - 1]?.focus(); }
  }

  return (
    <section className="mk-faq mk-bg-light section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mk-container">

        <div className="mk-faq__header reveal">
          <p className="mk-section-overline">FAQ</p>
          <h2 className="mk-faq__title">Gold rate questions answered</h2>
        </div>

        <dl
          className="mk-faq__list"
          role="group"
          aria-label="Gold rate frequently asked questions"
        >
          {items.map((item, i) => {
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
                    onKeyDown={e => handleKeyDown(e, i)}
                    aria-expanded={isOpen}
                    aria-controls={`gr-faq-answer-${i}`}
                    id={`gr-faq-q-${i}`}
                  >
                    <span className="mk-faq__question">{item.q}</span>
                    <span className="mk-faq__icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd
                  id={`gr-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`gr-faq-q-${i}`}
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
