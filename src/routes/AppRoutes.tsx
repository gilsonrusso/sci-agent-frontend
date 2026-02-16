import { Routes, Route } from 'react-router';
import AuthPage from '../features/auth/AuthPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import EditorPage from '../features/editor/EditorPage';
import ProjectSettingsPage from '../features/settings/ProjectSettingsPage';
import NotFoundPage from '../features/misc/NotFoundPage';

export const AppRoutes = () => (
  <Routes>
    <Route path='/' element={<AuthPage />} />
    <Route path='/dashboard' element={<DashboardPage />} />
    <Route path='/editor/:projectId' element={<EditorPage />} />
    <Route path='/settings/:projectId' element={<ProjectSettingsPage />} />
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);
