import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3949AB', // Deep Indigo
      light: '#5C6BC0',
      dark: '#283593',
    },
    secondary: {
      main: '#10B981', // Emerald Green
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#0F1419',
      paper: '#1A1F2E',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h1: { fontFamily: 'Inter, sans-serif', fontWeight: 600 },
    h2: { fontFamily: 'Inter, sans-serif', fontWeight: 600 },
    h3: { fontFamily: 'Inter, sans-serif', fontWeight: 600 },
    h4: { fontFamily: 'Inter, sans-serif', fontWeight: 600 },
    h5: { fontFamily: 'Inter, sans-serif', fontWeight: 500 },
    h6: { fontFamily: 'Inter, sans-serif', fontWeight: 500 },
    body1: { fontFamily: 'Inter, Roboto, sans-serif' },
    body2: { fontFamily: 'Inter, Roboto, sans-serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
