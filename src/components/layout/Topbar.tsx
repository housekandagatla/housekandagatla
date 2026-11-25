import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

type TopbarProps = {
  pageTitle: string;
  onMenuClick: () => void;
};

export function Topbar({ pageTitle, onMenuClick }: TopbarProps) {
  const { user, isAdmin, loading, configured, signInWithGoogle, signOut } = useAuth();

  const handleAuth = async () => {
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
        {user ? (
          <span className="kds-date-label">
            {isAdmin ? 'Admin' : 'Signed in'} · {user.email}
          </span>
        ) : (
          <span className="kds-date-label">A family space for everyone</span>
        )}
        {configured ? (
          <Button
            variant="secondary"
            type="button"
            onClick={handleAuth}
            disabled={loading}
            className="kds-auth-button"
          >
            {user ? 'Sign out' : 'Sign in with Google'}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
