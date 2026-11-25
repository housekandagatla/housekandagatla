import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider } from './context/AuthContext';
import { FamilyProvider } from './context/FamilyContext';
import { FamilyStoryPage } from './pages/FamilyStoryPage';
import { FamilyTreePage } from './pages/FamilyTreePage';
import { FestivalsPage } from './pages/FestivalsPage';
import { HeritagePage } from './pages/HeritagePage';
import { OverviewPage } from './pages/OverviewPage';

export default function App() {
  return (
    <AuthProvider>
      <FamilyProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<OverviewPage />} />
              <Route path="family-tree" element={<FamilyTreePage />} />
              <Route path="festivals" element={<FestivalsPage />} />
              <Route path="family-story" element={<FamilyStoryPage />} />
              <Route path="heritage" element={<HeritagePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FamilyProvider>
    </AuthProvider>
  );
}
