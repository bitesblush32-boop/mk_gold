import { MkSeal } from '@/components/ui/MkSeal';

export function MkFooterCoin() {
  return (
    <div
      style={{
        width: 96,
        height: 96,
        perspective: '700px',
        filter: 'drop-shadow(0 12px 24px rgba(0,0,0,.50)) drop-shadow(0 0 16px rgba(223,193,96,.30))',
      }}
      aria-label="MK Gold seal — MK Andare Nambike"
    >
      {/* Auto-spinning inner — shows EN front, KN back */}
      <div
        className="mk-coin-spin"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
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
  );
}
