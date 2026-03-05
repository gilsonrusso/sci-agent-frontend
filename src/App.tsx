import { useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import { CustomThemeProvider } from './theme/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/slices/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <CustomThemeProvider>
      <CssBaseline />
      <AppRoutes />
    </CustomThemeProvider>
  );
}

export default App;
