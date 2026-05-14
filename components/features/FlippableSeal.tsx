'use client';

import { useState } from 'react';
import { MkSeal } from '@/components/ui/MkSeal';

interface FlippableSealProps {
  size?: 'md' | 'lg';
  wobble?: boolean;
}

export function FlippableSeal({ size = 'md', wobble = false }: FlippableSealProps) {
  const [flipped, setFlipped] = useState(false);
  const px = size === 'lg' ? 130 : 96;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div
        className={wobble ? 'mk-coin-wobble' : undefined}
        style={{
          width: px,
          height: px,
          perspective: '700px',
          cursor: 'pointer',
          filter: 'drop-shadow(0 12px 28px rgba(0,0,0,.45)) drop-shadow(0 0 20px rgba(223,193,96,.35))',
        }}
        onClick={() => setFlipped(f => !f)}
        role="button"
        tabIndex={0}
        aria-label={flipped ? 'Showing Kannada — tap for English' : 'Showing English — tap for Kannada'}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped(f => !f)}
      >
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
            <MkSeal variant="en" size={size} animate={!flipped} />
          </div>

          {/* Back — KN */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden' as 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MkSeal variant="kn" size={size} />
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
