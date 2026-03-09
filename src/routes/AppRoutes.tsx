import { Routes, Route } from 'react-router';
import AuthPage from '../features/auth/AuthPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import EditorPage from '../features/editor/EditorPage';
import ProjectSettingsPage from '../features/settings/ProjectSettingsPage';
import OnboardingLayout from '../features/onboarding/OnboardingLayout';
import NotFoundPage from '../features/misc/NotFoundPage';
import ManagementLayout from '../features/management/ManagementLayout';
import MentorBoard from '../features/management/components/MentorBoard';
import CoordinatorRoadmap from '../features/management/components/CoordinatorRoadmap';
import ApprovalInbox from '../features/management/components/ApprovalInbox';
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
      <Route path='/onboarding' element={<OnboardingLayout />} />
      <Route path='/onboarding/c/:conversationId' element={<OnboardingLayout />} />

      {/* Management / Workflow Engine Routes */}
      <Route path='/management' element={<ManagementLayout />}>
        {/* Placeholder redirect will go here if needed, default to board */}
        <Route index element={<MentorBoard />} />
        <Route path='board' element={<MentorBoard />} />
        <Route path='roadmap' element={<CoordinatorRoadmap />} />
        <Route path='inbox' element={<ApprovalInbox />} />
      </Route>
    </Route>

    {/* Catch-all */}
    <Route path='*' element={<NotFoundPage />} />
  </Routes>
);
