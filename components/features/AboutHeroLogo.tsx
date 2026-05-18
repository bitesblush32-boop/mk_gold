'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Lang = 'en' | 'kn';

export function AboutHeroLogo() {
  const [lang, setLang]       = useState<Lang>('en');
  const [hovered, setHovered] = useState(false);
  const intervalRef           = useRef<ReturnType<typeof setInterval> | null>(null);

  function startInterval() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setLang(l => l === 'en' ? 'kn' : 'en');
    }, 5000);
  }

  useEffect(() => {
    startInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick() {
    setLang(l => l === 'en' ? 'kn' : 'en');
    startInterval(); // reset the 5s timer after manual toggle
  }

  const imgTransition = 'opacity 800ms ease-in-out';
  const wrapTransition = 'transform 260ms ease, filter 260ms ease';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', width: '100%' }}>

      {/* Logo wrapper — fills column width, height set by image aspect ratio */}
      <div
        role="button"
        tabIndex={0}
        aria-label={lang === 'en'
          ? 'MK Gold — Instant Money, Lasting Trust. Click for Kannada.'
          : 'MK Gold — ತಕ್ಷಣ ಹಣ, ನಿರಂತರ ನಂಬಿಕೆ. Click for English.'}
        onClick={handleClick}
        onKeyDown={e => e.key === 'Enter' && handleClick()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          aspectRatio: '1456 / 816',
          willChange: 'transform, filter',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          filter: hovered
            ? 'drop-shadow(0 0 28px rgba(223,193,96,0.55)) drop-shadow(0 8px 24px rgba(0,0,0,0.40))'
            : 'drop-shadow(0 8px 24px rgba(0,0,0,0.30)) drop-shadow(0 0 8px rgba(223,193,96,0.12))',
          transition: wrapTransition,
        }}
      >
        {/* Ambient gold glow behind — strengthens on hover */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-30%',
            background: 'radial-gradient(ellipse at center, rgba(223,193,96,0.14) 0%, transparent 65%)',
            opacity: hovered ? 1 : 0.5,
            transition: 'opacity 260ms ease',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* EN logo — front */}
        <Image
          src="/brand/logo_light_eng.png"
          alt="MK Gold — Instant Money, Lasting Trust"
          width={1456}
          height={816}
          priority
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: lang === 'en' ? 1 : 0,
            transition: imgTransition,
            zIndex: 2,
          }}
        />

        {/* KN logo — back */}
        <Image
          src="/brand/logo_light_kan.png"
          alt="MK Gold — ತಕ್ಷಣ ಹಣ, ನಿರಂತರ ನಂಬಿಕೆ"
          width={1456}
          height={816}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: lang === 'kn' ? 1 : 0,
            transition: imgTransition,
            zIndex: 1,
          }}
        />
      </div>

      {/* Language badge */}
      <span
        aria-live="polite"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '0.6rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(223,193,96,0.55)',
          userSelect: 'none',
          transition: 'opacity 260ms ease',
        }}
      >
        {lang === 'en' ? 'EN · Click for ಕನ್ನಡ' : 'ಕನ್ನಡ · Click for EN'}
      </span>

    </div>
  );
}
