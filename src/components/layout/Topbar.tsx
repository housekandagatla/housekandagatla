import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFamilyDateLabel } from '../../utils/teluguDate';
import { Icon } from '../ui/Icon';

type TopbarProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

export function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  const { user, isAdmin, loading, configured, signInWithGoogle, signOut } = useAuth();
  const dateLabel = useMemo(() => getFamilyDateLabel(), []);
  const authLabel = user ? 'Sign out' : 'Admin sign in';

  const handleAuth = async () => {
    if (!configured) {
      window.alert(
        'Firebase is not configured for this environment.\n\nAdd your VITE_FIREBASE_* values to a local .env file (see .env.example), then restart the dev server.\n\nOn the live site, those values come from GitHub Actions secrets.',
      );
      return;
    }

    try {
      if (user) {
        await signOut();
      } else {
        await signInWithGoogle();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign-in failed';
      window.alert(message);
    }
  };

  const authStatus = user
    ? `${isAdmin ? 'Admin · editing enabled' : 'Signed in · view only'}${
        user.email ? ` · ${user.email}` : ''
      }`
    : null;

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
          <span className="kds-breadcrumb-root">Kandagatla family</span>
          <span className="kds-breadcrumb-sep">/</span>
          <strong>{pageTitle}</strong>
        </div>
      </div>
      <div className="kds-topbar-right">
        <div className="kds-date-label" title={dateLabel.full}>
          <span className="kds-date-gregorian">{dateLabel.gregorian}</span>
          {dateLabel.telugu ? (
            <span className="kds-date-telugu kds-telugu" lang="te">
              {dateLabel.telugu}
            </span>
          ) : null}
          {authStatus ? <span className="kds-date-auth">{authStatus}</span> : null}
        </div>
        <button
          type="button"
          className={`kds-auth-button${user ? ' kds-is-signed-in' : ''}${
            isAdmin ? ' kds-is-admin' : ''
          }`}
          aria-label={authLabel}
          title={authLabel}
          onClick={handleAuth}
          disabled={loading}
        >
          <Icon name={user ? 'log_out' : 'log_in'} size={18} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
