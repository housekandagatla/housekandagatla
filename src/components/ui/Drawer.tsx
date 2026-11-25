import { useEffect, type ReactNode } from 'react';
import { Icon } from './Icon';

type DrawerProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  note?: string;
  wide?: boolean;
  className?: string;
};

export function Drawer({
  open,
  title,
  subtitle,
  eyebrow = 'HOUSE OF KANDAGATLA',
  onClose,
  children,
  note,
  wide = false,
  className = '',
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="kds-drawer-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className={`kds-drawer${wide ? ' kds-drawer-wide' : ''}${className ? ` ${className}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="kds-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="kds-drawer-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" size={18} strokeWidth={2} />
        </button>

        <div className="kds-eyebrow">{eyebrow}</div>
        <h2 id="kds-dialog-title" className="kds-serif">
          {title}
        </h2>
        {subtitle ? <p className="kds-dialog-copy">{subtitle}</p> : null}

        {children}
        {note ? <p className="kds-form-note">{note}</p> : null}
      </section>
    </div>
  );
}
