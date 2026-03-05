import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../store/hooks';
import { Box, CircularProgress } from '@mui/material';
import { useWorkflowStore } from '../features/management/store/workflowStore';

export const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const { setRole } = useWorkflowStore();

  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
  }, [user, setRole]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};
