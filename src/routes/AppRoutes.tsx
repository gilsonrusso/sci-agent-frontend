import { Routes, Route } from 'react-router';
import AuthPage from '../features/auth/AuthPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import EditorPage from '../features/editor/EditorPage';
import ProjectSettingsPage from '../features/settings/ProjectSettingsPage';
import OnboardingChat from '../features/onboarding/components/OnboardingChat';
import NotFoundPage from '../features/misc/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path='/' element={<AuthPage />} />

    {/* Protected Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path='/dashboard' element={<DashboardPage />} />
      <Route path='/editor/:id' element={<EditorPage />} />
      <Route path='/settings/:id' element={<ProjectSettingsPage />} />
      <Route path='/onboarding' element={<OnboardingChat />} />
    </Route>

    {/* Catch-all */}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);
