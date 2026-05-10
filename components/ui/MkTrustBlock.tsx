import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export interface MkTrustBlockProps {
  /** Short uppercase heading. Rendered in gold. */
  title?: string;
  /** Body copy. Rendered in muted white. */
  children: React.ReactNode;
  className?: string;
}

/* ─── Component ───────────────────────────────────────────────── */

/**
 * Left gold border statement block.
 * Used in trust sections on dark (plum-deep) backgrounds.
 * Title: gold, uppercase, Poppins 600.
 * Body: muted white (rgba 255 255 255 0.65), Poppins 400.
 */
export function MkTrustBlock({ title, children, className }: MkTrustBlockProps) {
  return (
    <div className={cn("mk-trust-block", className)}>
      {title && (
        <p className="mk-trust-block__title">{title}</p>
      )}
      <div className="mk-trust-block__body">
        {children}
      </div>
    </div>
  );
}
