'use client';
// F03 — Floating WhatsApp button — Tanker "W" mark, no icon libraries

import { useState, useEffect } from 'react';

interface MkWhatsAppProps {
  number?: string;
  message?: string;
}

export function MkWhatsApp({
  number = process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT ?? '918000000000',
  message = 'Hi, I want to sell my gold. Can you help?',
}: MkWhatsAppProps) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  const [isTouch, setIsTouch] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const activeTransform = isTouch
    ? 'scale(1.06)'
    : 'perspective(200px) translateZ(8px)';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 300,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#1BA448',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none',
        boxShadow: active
          ? '0 8px 32px rgba(27,164,72,0.55)'
          : '0 4px 20px rgba(27,164,72,0.4)',
        transform: active ? activeTransform : 'none',
        transition:
          'transform 520ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 260ms ease',
      }}
      onMouseEnter={!isTouch ? () => setActive(true) : undefined}
      onMouseLeave={!isTouch ? () => setActive(false) : undefined}
      onTouchStart={isTouch ? () => setActive(true) : undefined}
      onTouchEnd={isTouch ? () => setActive(false) : undefined}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'Tanker, serif',
          fontSize: '1.4rem',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        W
      </span>
    </a>
  );
}
