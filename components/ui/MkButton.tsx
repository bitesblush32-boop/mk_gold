import { cn } from "@/lib/utils";

/* ─── Types ──────────────────────────────────────────────────── */

export type ButtonVariant =
  | "gold"
  | "plum"
  | "outline-light"
  | "outline-plum"
  | "whatsapp";

export type ButtonSize = "sm" | "md" | "lg";

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
};

type AsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
    external?: never;
  };

type AsAnchor = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string;
    /** Set to true for external links — adds target="_blank" rel="noopener noreferrer". */
    external?: boolean;
  };

export type MkButtonProps = AsButton | AsAnchor;

/* ─── Maps ────────────────────────────────────────────────────── */

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  "gold":          "mk-btn--gold",
  "plum":          "mk-btn--plum",
  "outline-light": "mk-btn--outline-light",
  "outline-plum":  "mk-btn--outline-plum",
  "whatsapp":      "mk-btn--whatsapp",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "mk-btn--sm",
  md: "",
  lg: "mk-btn--lg",
};

/* ─── Component ───────────────────────────────────────────────── */

export function MkButton(props: MkButtonProps) {
  const { variant = "gold", size = "md", className, children } = props;

  const classes = cn(
    "mk-btn",
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    className,
  );

  if ("href" in props && props.href !== undefined) {
    const { href, external, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;

    return (
      <a
        href={href}
        className={classes}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, ...rest } = props as AsButton;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
