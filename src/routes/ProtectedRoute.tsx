import { Navigate, Outlet } from 'react-router';
import { useAppSelector } from '../store/hooks';
import { Box, CircularProgress } from '@mui/material';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

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
