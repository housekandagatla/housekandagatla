import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from './Icon';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  icon?: string;
  children: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'kds-btn_primary',
  secondary: 'kds-btn_secondary',
  danger: 'kds-btn_danger',
};

export function Button({
  variant = 'primary',
  icon,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`kds-btn ${variantClass[variant]}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {icon ? <Icon name={icon} size={16} strokeWidth={2} /> : null}
      <span>{children}</span>
    </button>
  );
}
