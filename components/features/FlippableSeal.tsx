import { MkSeal } from '@/components/ui/MkSeal';

interface FlippableSealProps {
  size?: 'md' | 'lg';
  wobble?: boolean;
}

export function FlippableSeal({ size = 'md' }: FlippableSealProps) {
  const px = size === 'lg' ? 130 : 96;

  return (
    <div
      style={{
        width: px,
        height: px,
        perspective: '700px',
        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,.45)) drop-shadow(0 0 20px rgba(223,193,96,.35))',
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
          <MkSeal variant="en" size={size} />
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
  );
}
