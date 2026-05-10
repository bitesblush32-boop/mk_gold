import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type BadgeVariant = "gold" | "white" | "plum" | "gallery" | "green";

export interface MkBadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

/* ─── Maps ────────────────────────────────────────────────────── */

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  gold:    "mk-badge--gold",
  plum:    "mk-badge--plum",
  white:   "mk-badge--white",
  gallery: "mk-badge--gallery",
  green:   "mk-badge--green",
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkBadge({
  variant = "gold",
  className,
  children,
}: MkBadgeProps) {
  return (
    <span className={cn("mk-badge", VARIANT_CLASS[variant], className)}>
      {children}
    </span>
  );
}
