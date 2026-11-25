import { Link } from 'react-router-dom';
import { Icon } from './Icon';

type StatTone = 'green' | 'gold' | 'rose';

type StatCardProps = {
  value: number | string;
  label: string;
  icon: string;
  tone: StatTone;
  to: string;
  actionLabel: string;
};

export function StatCard({ value, label, icon, tone, to, actionLabel }: StatCardProps) {
  return (
    <article className="kds-stat-card">
      <span className={`kds-stat-icon kds-${tone}`}>
        <Icon name={icon} size={18} strokeWidth={1.8} />
      </span>
      <span className="kds-stat-copy">
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
      <Link className="kds-stat-action" to={to} aria-label={actionLabel}>
        <Icon name="south_east" size={16} strokeWidth={1.8} />
      </Link>
    </article>
  );
}
