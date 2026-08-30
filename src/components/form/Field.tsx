import type { ReactNode, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

interface BaseProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export function TextField({
  label,
  required,
  error,
  hint,
  className = "",
  ...rest
}: BaseProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <input className="input" {...rest} />
      {hint && !error && <p className="mt-1 text-xs text-navy-700/55">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  required,
  error,
  hint,
  className = "",
  ...rest
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <textarea className="input min-h-[96px] resize-y" {...rest} />
      {hint && !error && <p className="mt-1 text-xs text-navy-700/55">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function SelectField({
  label,
  required,
  error,
  hint,
  className = "",
  children,
  ...rest
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
      <select className="input" {...rest}>
        {children}
      </select>
      {hint && !error && <p className="mt-1 text-xs text-navy-700/55">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export function CheckboxField({
  label,
  checked,
  onChange,
  className = "",
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-navy-900/25 text-royal-600 focus:ring-royal-600"
      />
      <span className="text-sm leading-relaxed text-navy-800">{label}</span>
    </label>
  );
}

export function FieldsetTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-semibold text-navy-950">{children}</h3>
      {subtitle && <p className="mt-1 text-sm text-navy-700/60">{subtitle}</p>}
    </div>
  );
}
