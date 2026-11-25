import { Icon } from '../ui/Icon';

type TopbarProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

export function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  return (
    <header className="kds-topbar">
      <div className="kds-topbar-left">
        <button
          type="button"
          className="kds-menu-toggle"
          aria-label="Toggle navigation"
          aria-expanded={undefined}
          onClick={onMenuClick}
        >
          <Icon name="menu" size={20} strokeWidth={1.8} />
        </button>
        <div className="kds-breadcrumb">
          Kandagatla family <span>/</span> <strong>{pageTitle}</strong>
        </div>
      </div>
      <div className="kds-topbar-right">
        <span className="kds-date-label">A family space for everyone</span>
      </div>
    </header>
  );
}
