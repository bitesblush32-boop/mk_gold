'use client';

import { useState, useRef } from 'react';

export interface FaqItem { q: string; a: string; }

interface CityFaqProps {
  faqs: FaqItem[];
  /** Must be unique per page to avoid duplicate aria ids */
  idPrefix: string;
}

export function CityFaq({ faqs, idPrefix }: CityFaqProps) {
  const [open, setOpen] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (i: number) => setOpen(open === i ? null : i);

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    const count = faqs.length;
    if (e.key === 'ArrowDown') { e.preventDefault(); triggerRefs.current[(i + 1) % count]?.focus(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); triggerRefs.current[(i - 1 + count) % count]?.focus(); }
    if (e.key === 'Home')      { e.preventDefault(); triggerRefs.current[0]?.focus(); }
    if (e.key === 'End')       { e.preventDefault(); triggerRefs.current[count - 1]?.focus(); }
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <section className="mk-faq mk-bg-light section" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="mk-container">
        <div className="mk-faq__header reveal">
          <p className="mk-section-overline">FAQ</p>
          <h2 className="mk-faq__title">Common questions answered</h2>
        </div>

        <dl
          className="mk-faq__list"
          role="group"
          aria-label="Frequently asked questions"
        >
          {faqs.map((item, i) => {
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
                    aria-controls={`${idPrefix}-faq-answer-${i}`}
                    id={`${idPrefix}-faq-q-${i}`}
                  >
                    <span className="mk-faq__question">{item.q}</span>
                    <span className="mk-faq__icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd
                  id={`${idPrefix}-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`${idPrefix}-faq-q-${i}`}
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
