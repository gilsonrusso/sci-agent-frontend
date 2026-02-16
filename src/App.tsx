import { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { AppRoutes } from './routes/AppRoutes';
import { useAppDispatch } from './store/hooks';
import { checkAuth } from './store/slices/authSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
