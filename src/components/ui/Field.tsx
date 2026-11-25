import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
};

export function Field({ label, htmlFor, children, hint }: FieldProps) {
  return (
    <div className="kds-field">
      {htmlFor ? (
        <label className="kds-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      ) : (
        <span className="kds-field-label">{label}</span>
      )}
      {children}
      {hint ? <span className="kds-field-hint">{hint}</span> : null}
    </div>
  );
}
