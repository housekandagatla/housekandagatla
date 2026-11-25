import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { PageFooter } from './PageFooter';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const titles: Record<string, string> = {
  '/': 'Overview',
  '/family-tree': 'Family tree',
  '/festivals': 'Family festivals',
  '/family-story': 'Family story',
  '/heritage': 'Our heritage',
};

export function AppShell() {
  const location = useLocation();
  const isTablet = useMediaQuery('(max-width: 760px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isTablet) {
      setSidebarOpen(false);
    }
  }, [isTablet]);

  const pageTitle = titles[location.pathname] ?? 'Overview';

  return (
    <div className="kds-app-shell">
      {isTablet ? (
        <button
          type="button"
          className={`kds-sidebar-backdrop${sidebarOpen ? ' kds-is-open' : ''}`}
          aria-label="Close navigation"
          aria-hidden={!sidebarOpen}
          tabIndex={sidebarOpen ? 0 : -1}
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <div className="kds-main-content">
        <Topbar pageTitle={pageTitle} onMenuClick={() => setSidebarOpen((open) => !open)} />
        <div className="kds-page-wrap">
          <Outlet />
          <PageFooter />
        </div>
      </div>
    </div>
  );
}
