import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useFamily } from '../../context/FamilyContext';
import { getFamilyDateLabel } from '../../utils/teluguDate';
import { Icon } from '../ui/Icon';

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
        aria-label="House of Kandagatla home"
        onClick={onNavigate}
      >
        <span className="kds-brand-emblem">
          <Icon name="spa" size={23} strokeWidth={1.6} />
        </span>
        <span className="kds-brand-title">
          House of
          <br />
          Kandagatla
        </span>
      </NavLink>

      <div className="kds-family-switcher">
        <span className="kds-family-monogram">K</span>
        <span className="kds-family-switch-text">
          <strong>Kandagatla family</strong>
          <small>Family space</small>
        </span>
      </div>

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

      <p className="kds-nav-caption">OUR FAMILY</p>

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
        <span className="kds-note-sparkle" aria-hidden="true">
          <Icon name="spa" size={14} strokeWidth={1.6} />
        </span>
      </div>

      <div className="kds-sidebar-family-note">
        <Icon name="people" size={16} strokeWidth={1.8} />
        <span>A family space for everyone</span>
      </div>
    </aside>
  );
}
