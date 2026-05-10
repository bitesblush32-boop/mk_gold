import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type LogoVariant = "light" | "dark";
export type LogoLayout  = "horizontal" | "stacked";
export type LogoSize    = "sm" | "md" | "lg";

export interface MkLogoProps {
  /** Light = on dark/plum bg (default 95%). Dark = on gallery/white bg. */
  variant?: LogoVariant;
  /** Horizontal = default 95% of uses. Stacked = 5%, mobile/narrow only. */
  layout?: LogoLayout;
  /** sm = compact nav / mobile. md = default. lg = hero / print. */
  size?: LogoSize;
  /** Wraps logo in an <a> when provided. */
  href?: string;
  className?: string;
  /** Override the anchor/element tag aria-label. */
  ariaLabel?: string;
}

/* ─── Size tokens ─────────────────────────────────────────────── */

const SIZE: Record<LogoSize, { wordmark: string; tagline: string }> = {
  sm: { wordmark: "1.25rem", tagline: "0.30rem" },
  md: { wordmark: "1.75rem", tagline: "0.42rem" },
  lg: { wordmark: "2.4rem",  tagline: "0.575rem" },
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkLogo({
  variant  = "light",
  layout   = "horizontal",
  size     = "md",
  href     = "/",
  className,
  ariaLabel = "MK Gold — Instant Money, Lasting Trust",
}: MkLogoProps) {
  const { wordmark, tagline } = SIZE[size];

  const inner = (
    <span
      className={cn(
        "mk-logo",
        variant === "light" ? "mk-logo--light" : "mk-logo--dark",
        layout  === "stacked" ? "mk-logo--stacked" : "",
        className,
      )}
      /* Clear space = width of "O" ≈ 0.55 × wordmark size on all four sides */
      style={{ padding: `calc(${wordmark} * 0.55)` }}
      aria-label={ariaLabel}
      role="img"
    >
      <span
        className="mk-logo__wordmark"
        style={{ fontSize: wordmark }}
      >
        <span className="mk-logo__mk">MK</span>
        <span className="mk-logo__gold-text">GOLD</span>
      </span>
      <span
        className="mk-logo__tagline"
        style={{ fontSize: tagline }}
      >
        Instant Money, Lasting Trust
      </span>
    </span>
  );

  if (!href) return inner;

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      style={{ textDecoration: "none", display: "inline-flex" }}
    >
      {inner}
    </a>
  );
}
