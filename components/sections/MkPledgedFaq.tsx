'use client';
// Pledged gold specific FAQ accordion — mirrors MkFaq visual style

import { useState, useRef } from 'react';

const FAQS = [
  {
    q: 'How quickly can the release happen?',
    a: 'In most cases, the same day. Once you share your loan details and lender branch, we coordinate a visit together. The lender releases your gold the moment the outstanding amount is settled — which we do directly in front of you.',
  },
  {
    q: 'What documents do you need from me?',
    a: 'Your original loan agreement or pledge card from the lender, and one valid government photo ID — Aadhaar, PAN, or Passport. You do not need original purchase receipts or hallmark certificates for the gold.',
  },
  {
    q: 'What if my gold is pledged with multiple lenders?',
    a: 'We handle each lender separately. Each outstanding loan is settled individually, and you receive the balance from each transaction. There is no additional complexity or paperwork for you to manage.',
  },
  {
    q: 'Is this process fully legal?',
    a: 'Yes. We repay your outstanding loan through a standard banking transaction, directly to the lender in front of you. The lender then releases your gold. We then proceed with the purchase if you choose to sell. Every step follows RBI guidelines for gold loan settlement.',
  },
  {
    q: 'Will MK Gold buy my gold after it is released?',
    a: 'That is entirely your choice. Once your gold is released, you decide what to do with it. Many customers choose to sell to us at the same visit, but there is no obligation at any point. We are here to help you recover your gold — nothing more.',
  },
] as const;

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export function MkPledgedFaq() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
      <div className="mk-container">
        <div className="mk-faq__header reveal">
          <p className="mk-section-overline">FAQ</p>
          <h2 className="mk-faq__title">Common questions</h2>
        </div>
        <dl
          className="mk-faq__list"
          role="group"
          aria-label="Frequently asked questions about pledged gold release"
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
                    aria-controls={`pledged-faq-answer-${i}`}
                    id={`pledged-faq-q-${i}`}
                  >
                    <span className="mk-faq__question">{item.q}</span>
                    <span className="mk-faq__icon" aria-hidden="true" />
                  </button>
                </dt>
                <dd
                  id={`pledged-faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`pledged-faq-q-${i}`}
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
