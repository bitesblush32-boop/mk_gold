import { cn } from '@/lib/utils';

/* ─── Props ──────────────────────────────────────────────────── */

export interface MkSectionHeaderProps {
  tag: string;
  title: string;
  accentWord?: string;
  subtitle?: string;
  align?: 'center' | 'left';
  dark?: boolean;
  className?: string;
}

/* ─── Helpers ────────────────────────────────────────────────── */

/** Replace the first occurrence of accentWord in title with a gold <span> */
function renderTitle(title: string, accentWord?: string) {
  if (!accentWord) return title;
  const idx = title.indexOf(accentWord);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="mk-sh__accent">{accentWord}</span>
      {title.slice(idx + accentWord.length)}
    </>
  );
}

/* ─── Component ───────────────────────────────────────────────── */

export function MkSectionHeader({
  tag,
  title,
  accentWord,
  subtitle,
  align = 'center',
  dark = false,
  className,
}: MkSectionHeaderProps) {
  return (
    <div
      className={cn(
        'mk-sh',
        align === 'left' && 'mk-sh--left',
        dark && 'mk-sh--dark',
        className,
      )}
    >
      <div className="mk-sh__eyebrow">
        <span className="mk-sh__line" aria-hidden="true" />
        <span className="mk-sh__tag">{tag}</span>
        <span className="mk-sh__line" aria-hidden="true" />
      </div>

      <h2 className="mk-sh__title">
        {renderTitle(title, accentWord)}
      </h2>

      {subtitle && (
        <p className="mk-sh__subtitle">{subtitle}</p>
      )}
    </div>
  );
}
