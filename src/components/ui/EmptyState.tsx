import type { ReactNode } from 'react';
import { Icon } from './Icon';

type EmptyStateProps = {
  kicker?: string;
  title: ReactNode;
  description: string;
  footnote?: string;
  icon?: string;
  action?: ReactNode;
};

export function EmptyState({
  kicker,
  title,
  description,
  footnote,
  icon = 'local_florist',
  action,
}: EmptyStateProps) {
  return (
    <section className="kds-empty-state">
      <div className="kds-empty-icon">
        <Icon name={icon} size={29} strokeWidth={1.2} />
      </div>
      {kicker ? <div className="kds-eyebrow">{kicker}</div> : null}
      <h2 className="kds-serif">{title}</h2>
      <p>{description}</p>
      {action}
      {footnote ? <span className="kds-empty-footnote">{footnote}</span> : null}
    </section>
  );
}
