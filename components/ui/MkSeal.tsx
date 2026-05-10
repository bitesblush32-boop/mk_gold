import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type SealVariant = "en" | "kn";
export type SealSize    = "sm" | "md" | "lg";

export interface MkSealProps {
  /** en = English "Andare Nambike". kn = Kannada "ಅಂದರೆ ನಂಬಿಕೆ". */
  variant?: SealVariant;
  size?: SealSize;
  className?: string;
  /** Animate entrance (sealBounce keyframe) on first render. */
  animate?: boolean;
}

/* ─── Size tokens ─────────────────────────────────────────────── */

const SIZE_CLASS: Record<SealSize, string> = {
  sm: "mk-seal--sm",
  md: "",
  lg: "mk-seal--lg",
};

/* ─── Content ─────────────────────────────────────────────────── */

const CONTENT: Record<SealVariant, { mk: string; sub: string; lang?: string }> = {
  en: { mk: "MK",   sub: "Andare Nambike" },
  kn: { mk: "MK",   sub: "ಅಂದರೆ ನಂಬಿಕೆ",  lang: "kn" },
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkSeal({
  variant = "en",
  size    = "md",
  animate = false,
  className,
}: MkSealProps) {
  const { mk, sub, lang } = CONTENT[variant];

  return (
    <div
      className={cn(
        "mk-seal",
        SIZE_CLASS[size],
        variant === "kn" && "mk-seal--kannada",
        animate && "mk-seal--animate",
        className,
      )}
      aria-label={`MK Gold seal — ${sub}`}
      role="img"
    >
      <span
        className="mk-seal__main"
        lang={lang}
      >
        {mk}
      </span>
      <span
        className="mk-seal__sub"
        lang={lang}
      >
        {sub}
      </span>
    </div>
  );
}
