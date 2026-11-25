import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFamilyDateLabel } from '../../utils/teluguDate';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

type TopbarProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

export function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  const { user, isAdmin, loading, configured, signInWithGoogle, signOut } = useAuth();
  const dateLabel = useMemo(() => getFamilyDateLabel(), []);

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

  const authStatus = !configured
    ? 'Firebase not configured'
    : user
      ? isAdmin
        ? 'Admin · editing enabled'
        : 'Signed in · view only'
      : 'Sign in to manage family records';

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
        <div className="kds-date-label" title={dateLabel.full}>
          <span className="kds-date-gregorian">{dateLabel.gregorian}</span>
          {dateLabel.telugu ? (
            <span className="kds-date-telugu kds-telugu" lang="te">
              {dateLabel.telugu}
            </span>
          ) : null}
          <span className="kds-date-auth">
            {authStatus}
            {user?.email ? ` · ${user.email}` : ''}
          </span>
        </div>
        <Button
          variant="secondary"
          type="button"
          onClick={handleAuth}
          disabled={loading}
          className="kds-auth-button"
        >
          {user ? 'Sign out' : 'Admin sign in'}
        </Button>
      </div>
    </header>
  );
}
