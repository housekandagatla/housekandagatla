import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { getFamilyDateLabel } from '../../utils/teluguDate';
import { Icon } from '../ui/Icon';
import { WeaverMark } from '../ui/WeaverMark';

const navItems = [
  { to: '/', label: 'Overview', icon: 'home', end: true },
  { to: '/family-tree', label: 'Family tree', icon: 'users', end: false },
  { to: '/festivals', label: 'Family festivals', icon: 'calendar_days', end: false, showCount: true },
  { to: '/family-story', label: 'Family story', icon: 'book_open', end: false },
  { to: '/heritage', label: 'Our heritage', icon: 'flower2', end: false },
] as const;

type SidebarProps = {
  open: boolean;
  onNavigate: () => void;
};

export function Sidebar({ open, onNavigate }: SidebarProps) {
  const { festivals } = useFamily();
  const dateLabel = useMemo(() => getFamilyDateLabel(), []);

  return (
    <aside className={`kds-sidebar${open ? ' kds-is-open' : ''}`} aria-label="Family navigation">
      <NavLink
        className="kds-brand-lockup"
        to="/"
        aria-label="House Kandagatla home"
        onClick={onNavigate}
      >
        <span className="kds-brand-emblem">
          <WeaverMark size={40} label="House Kandagatla" />
        </span>
        <span className="kds-brand-title">
          House
          <br />
          Kandagatla
        </span>
      </NavLink>

      <div className="kds-sidebar-calendar" title={dateLabel.full}>
        <span className="kds-sidebar-calendar-icon" aria-hidden="true">
          <Icon name="calendar_days" size={16} strokeWidth={1.8} />
        </span>
        <div className="kds-sidebar-calendar-copy">
          <strong>{dateLabel.gregorian}</strong>
          {dateLabel.telugu ? (
            <small className="kds-telugu" lang="te">
              {dateLabel.telugu}
            </small>
          ) : null}
        </div>
      </div>

      <nav className="kds-main-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `kds-nav-link${isActive ? ' kds-is-active' : ''}`}
            onClick={onNavigate}
          >
            <Icon name={item.icon} size={18} strokeWidth={1.8} />
            <span>{item.label}</span>
            {'showCount' in item && item.showCount && festivals.length > 0 ? (
              <span className="kds-nav-count">{festivals.length}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <div className="kds-sidebar-spacer" />

      <div className="kds-heritage-note">
        <span className="kds-heritage-icon" aria-hidden="true">
          <Icon name="eco" size={16} strokeWidth={1.8} />
        </span>
        <p>
          Rooted in tradition.
          <br />
          <strong>Growing together.</strong>
        </p>
      </div>

      <a
        className="kds-sidebar-contact"
        href="https://saikrishna-nu.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
      >
        <Icon name="people" size={16} strokeWidth={1.8} />
        <span>
          Want to add a family detail?
          <strong> Contact Sai Krishna</strong>
        </span>
      </a>
    </aside>
  );
}
