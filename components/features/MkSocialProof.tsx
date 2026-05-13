'use client';
// N20 — Social proof notification card (bottom-left, auto-rotating)

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── Messages ───────────────────────────────────────────────── */

const MESSAGES = [
  { initials: 'SK', area: 'Rajajinagar',  type: 'jewellery',      value: '₹84,000'   },
  { initials: 'KN', area: 'Gokulam',      type: 'gold coins',     value: '₹1,12,000' },
  { initials: 'MR', area: 'Mangalore',    type: '22K jewellery',  value: '₹67,500'   },
  { initials: 'AR', area: 'Koramangala',  type: 'old bangles',    value: '₹43,200'   },
  { initials: 'VS', area: 'Kadri',        type: 'broken gold',    value: '₹28,900'   },
  { initials: 'PS', area: 'Davangere',    type: 'gold bars',      value: '₹2,45,000' },
  { initials: 'RK', area: 'Jayanagar',    type: 'mixed lot',      value: '₹1,08,000' },
  { initials: 'LM', area: 'Whitefield',   type: 'pledged gold',   value: '₹91,500'   },
] as const;

const EXCLUDED_PATHS = ['/sell-gold', '/release-pledged-gold', '/contact'];
const SHOW_DELAY_MS   = 4000;
const ROTATE_MS       = 6000;
const AUTO_HIDE_MS    = 45000;
const FADE_MS         = 300;

export function MkSocialProof() {
  const pathname = usePathname();
  const [shown,     setShown]     = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [idx,       setIdx]       = useState(0);
  const [entering,  setEntering]  = useState(true);

  // Don't render on excluded paths
  if (EXCLUDED_PATHS.includes(pathname)) return null;

  // Show after delay, auto-hide after 45s
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const t1 = setTimeout(() => setShown(true), SHOW_DELAY_MS);
    const t2 = setTimeout(() => setShown(false), SHOW_DELAY_MS + AUTO_HIDE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Rotate messages while shown and not dismissed
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!shown || dismissed) return;
    const interval = setInterval(() => {
      setEntering(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % MESSAGES.length);
        setEntering(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [shown, dismissed]);

  function dismiss() { setDismissed(true); }

  if (!shown || dismissed) return null;

  const msg = MESSAGES[idx];

  return (
    <div
      style={{ position: 'fixed', bottom: '1.5rem', left: '1.5rem', zIndex: 200 }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="mk-sp__card"
        style={{
          opacity: entering ? 1 : 0,
          transform: entering ? 'translateX(0)' : 'translateX(-8px)',
        }}
      >
        <div className="mk-sp__avatar" aria-hidden="true">
          {msg.initials}
        </div>
        <div className="mk-sp__body">
          <p className="mk-sp__name">{msg.initials[0]} from {msg.area}</p>
          <p className="mk-sp__text">
            received <strong>{msg.value}</strong> for {msg.type}
          </p>
        </div>
        <button className="mk-sp__close" onClick={dismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
    </div>
  );
}
