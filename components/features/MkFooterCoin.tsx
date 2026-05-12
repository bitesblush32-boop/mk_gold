'use client';

import { useState } from 'react';
import { MkSeal } from '@/components/ui/MkSeal';

export function MkFooterCoin() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      {/* Perspective + glow wrapper */}
      <div
        style={{
          width: 96,
          height: 96,
          perspective: '700px',
          cursor: 'pointer',
          filter:
            'drop-shadow(0 12px 24px rgba(0,0,0,.50)) drop-shadow(0 0 16px rgba(223,193,96,.30))',
        }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Showing Kannada — tap for English' : 'Showing English — tap for Kannada'}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped(f => !f)}
      >
        {/* Flip inner */}
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            willChange: 'transform',
          }}
        >
          {/* Front — EN */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden' as 'hidden',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MkSeal variant="en" size="md" />
          </div>

          {/* Back — KN */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden' as 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MkSeal variant="kn" size="md" />
          </div>
        </div>
      </div>

      {/* Hint label */}
      <span style={{
        fontFamily: 'Poppins, sans-serif',
        fontSize: '0.6rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(223,193,96,0.55)',
        userSelect: 'none',
      }}>
        {flipped ? 'MK ಅಂದರೆ ನಂಬಿಕೆ' : 'Tap to flip'}
      </span>
    </div>
  );
}
