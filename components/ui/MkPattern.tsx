import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type PatternVariant = "dark" | "light" | "purple";

export interface MkPatternProps {
  /** dark = plum-deep bg (hero, footer). light = gallery bg. purple = plum bg (CTA band). */
  variant?: PatternVariant;
  /** Render as a different HTML element. Defaults to div. */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

/* ─── Variant → CSS class map ─────────────────────────────────── */

const VARIANT_CLASS: Record<PatternVariant, string> = {
  dark:   "mk-bg-dark",
  light:  "mk-bg-light",
  purple: "mk-bg-purple",
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkPattern({
  variant  = "dark",
  as: Tag  = "div",
  className,
  style,
  children,
}: MkPatternProps) {
  return (
    <Tag
      className={cn(VARIANT_CLASS[variant], className)}
      style={style}
    >
      {children}
    </Tag>
  );
}
