import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type CardVariant = "default" | "plum" | "gallery" | "gold-border";

export interface MkCardProps {
  variant?: CardVariant;
  /** Enable the lift-on-hover effect (translateY(-4px)). Default: true. */
  hover?: boolean;
  /** Render as a different element — e.g. "article", "li". */
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/* ─── Maps ────────────────────────────────────────────────────── */

const VARIANT_CLASS: Record<CardVariant, string> = {
  "default":     "",
  "plum":        "mk-card--plum",
  "gallery":     "mk-card--gallery",
  "gold-border": "mk-card--gold-border",
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkCard({
  variant  = "default",
  hover    = true,
  as: Tag  = "div",
  className,
  style,
  children,
}: MkCardProps) {
  return (
    <Tag
      className={cn(
        "mk-card",
        VARIANT_CLASS[variant],
        !hover && "mk-card--no-hover",
        className,
      )}
      style={style}
    >
      {children}
    </Tag>
  );
}
