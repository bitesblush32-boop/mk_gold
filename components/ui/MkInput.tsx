import { useId } from "react";
import { cn } from "@/lib/utils";

/* ─── Shared types ────────────────────────────────────────────── */

export type InputSurface = "light" | "dark";

interface FieldWrapperProps {
  label?: string;
  hint?: string;
  error?: string;
  surface?: InputSurface;
  fieldId: string;
}

function FieldWrapper({
  label,
  hint,
  error,
  surface = "light",
  fieldId,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn("mk-label", surface === "dark" && "mk-label--dark")}
        >
          {label}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className={cn("mk-field-hint", surface === "dark" && "mk-field-hint--dark")}>
          {hint}
        </p>
      )}
      {error && (
        <p className="mk-field-error" role="alert" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MkInput
   ═══════════════════════════════════════════════════════════════ */

export interface MkInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  label?: string;
  hint?: string;
  error?: string;
  /** light = white bg + plum border. dark = translucent bg + white border. */
  surface?: InputSurface;
  /** Explicit id — if omitted, a stable auto-id is generated. */
  id?: string;
}

export function MkInput({
  label,
  hint,
  error,
  surface = "light",
  id: explicitId,
  className,
  ...props
}: MkInputProps) {
  const autoId = useId();
  const fieldId = explicitId ?? autoId;

  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      surface={surface}
      fieldId={fieldId}
    >
      <input
        id={fieldId}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mk-input",
          surface === "dark" && "mk-input--dark",
          error && "mk-input--error",
          className,
        )}
        {...props}
      />
    </FieldWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MkSelect
   ═══════════════════════════════════════════════════════════════ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface MkSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  options: SelectOption[];
  label?: string;
  hint?: string;
  error?: string;
  /** light = white bg + plum border. dark = translucent bg + white border. */
  surface?: InputSurface;
  /** Placeholder option text. Disabled by default. */
  placeholder?: string;
  id?: string;
}

export function MkSelect({
  options,
  label,
  hint,
  error,
  surface = "light",
  placeholder,
  id: explicitId,
  className,
  ...props
}: MkSelectProps) {
  const autoId = useId();
  const fieldId = explicitId ?? autoId;

  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      surface={surface}
      fieldId={fieldId}
    >
      <select
        id={fieldId}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mk-select",
          surface === "dark" && "mk-select--dark",
          error && "mk-select--error",
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MkTextarea
   ═══════════════════════════════════════════════════════════════ */

export interface MkTextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  label?: string;
  hint?: string;
  error?: string;
  surface?: InputSurface;
  id?: string;
}

export function MkTextarea({
  label,
  hint,
  error,
  surface = "light",
  id: explicitId,
  className,
  rows = 4,
  ...props
}: MkTextareaProps) {
  const autoId = useId();
  const fieldId = explicitId ?? autoId;

  return (
    <FieldWrapper
      label={label}
      hint={hint}
      error={error}
      surface={surface}
      fieldId={fieldId}
    >
      <textarea
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={cn(
          "mk-textarea",
          surface === "dark" && "mk-textarea--dark",
          error && "mk-input--error",
          className,
        )}
        style={{ resize: "vertical" }}
        {...props}
      />
    </FieldWrapper>
  );
}
