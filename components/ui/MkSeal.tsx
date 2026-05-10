import Image from 'next/image';
import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type SealVariant = "en" | "kn";
export type SealSize    = "sm" | "md" | "lg";

export interface MkSealProps {
  /** en = English coin. kn = Kannada coin. */
  variant?: SealVariant;
  /** sm = 72px · md = 96px · lg = 120px — both variants always identical size */
  size?: SealSize;
  className?: string;
  /** Animate entrance (sealBounce keyframe) on first render. */
  animate?: boolean;
}

/* ─── Size tokens — same for both variants ────────────────────── */

const SIZE_PX: Record<SealSize, number> = {
  sm: 72,
  md: 96,
  lg: 120,
};

/* ─── Image map ───────────────────────────────────────────────── */

const SRC: Record<SealVariant, string> = {
  en: '/brand/coin_eng.png',
  kn: '/brand/coin_kan.png',
};

const ALT: Record<SealVariant, string> = {
  en: 'MK Gold — MK Andare Nambike seal',
  kn: 'MK Gold — MK ಅಂದರೆ ನಂಬಿಕೆ seal',
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkSeal({
  variant = "en",
  size    = "md",
  animate = false,
  className,
}: MkSealProps) {
  const px = SIZE_PX[size];

  return (
    <Image
      src={SRC[variant]}
      alt={ALT[variant]}
      width={px}
      height={px}
      className={cn(animate && "mk-seal--animate", className)}
      style={{ width: px, height: px, objectFit: 'contain' }}
    />
  );
}
