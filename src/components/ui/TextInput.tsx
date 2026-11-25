import type { InputHTMLAttributes } from 'react';

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ className = '', ...props }: TextInputProps) {
  return <input className={`kds-control${className ? ` ${className}` : ''}`} {...props} />;
}
