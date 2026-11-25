import type { TextareaHTMLAttributes } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className = '', ...props }: TextAreaProps) {
  return <textarea className={`kds-control${className ? ` ${className}` : ''}`} {...props} />;
}
