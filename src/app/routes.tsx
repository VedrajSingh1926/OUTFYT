import { createBrowserRouter, Navigate } from 'react-router';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { MainDashboard } from './pages/MainDashboard';
import { AIStylist } from './pages/AIStylist';
import { HistoryPage } from './pages/HistoryPage';
import { SavedLooks } from './pages/SavedLooks';
import { SettingsPage } from './pages/SettingsPage';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StyleSyncProvider } from '@/context/StyleSyncContext';
import { LiveMirror } from './pages/LiveMirror';
import { QuickGenerateProvider } from '@/context/QuickGenerateContext';

function AppShell() {
  return (
    <ProtectedRoute>
      <StyleSyncProvider>
        <QuickGenerateProvider>
          <DashboardLayout />
        </QuickGenerateProvider>
      </StyleSyncProvider>
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/app/stylist" replace /> },
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignupPage },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="/app/stylist" replace /> },
      { path: 'dashboard', Component: MainDashboard },
      { path: 'mirror', Component: LiveMirror },
      { path: 'stylist', Component: AIStylist },
      { path: 'history', Component: HistoryPage },
      { path: 'saved', Component: SavedLooks },
      { path: 'settings', Component: SettingsPage },
      { path: 'recommendations', element: <Navigate to="/app/stylist" replace /> },
      { path: 'chat', element: <Navigate to="/app/stylist" replace /> },
    ],
  },
  { path: '/privacy', Component: PrivacyPolicy },
  { path: '/terms', Component: TermsConditions },
]);
