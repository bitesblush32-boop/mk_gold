'use client';
// Branch-specific FAQ accordion — accepts dynamic FAQs as props

import { useState, useRef } from 'react';
import type { FaqItem } from '@/lib/schema/faq-page';

interface MkBranchFaqProps {
  faqs: FaqItem[];
  areaName: string;
}

export function MkBranchFaq({ faqs, areaName }: MkBranchFaqProps) {
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

  return (
    <section className="mk-faq mk-bg-light section" id="faq">
      <div className="mk-container">
        <div className="mk-faq__header reveal">
          <p className="mk-section-overline">FAQ</p>
          <h2 className="mk-faq__title">
            Questions about MK Gold {areaName}
          </h2>
        </div>
        <dl
          className="mk-faq__list"
          role="group"
          aria-label={`Frequently asked questions about MK Gold ${areaName}`}
        >
          {faqs.map((faq, i) => {
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
                    aria-controls={`branch-faq-answer-${i}`}
                    id={`branch-faq-q-${i}`}
                  >
                    <span className="mk-faq__question">{faq.question}</span>
                    <span className="mk-faq__icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd
                  id={`branch-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`branch-faq-q-${i}`}
                  className="mk-faq__answer"
                  hidden={!isOpen}
                >
                  <p className="mk-faq__answer-text">{faq.answer}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
