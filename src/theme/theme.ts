import { createTheme, type ThemeOptions } from '@mui/material';

const typography: ThemeOptions['typography'] = {
  fontFamily: ['Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'].join(','),
};

const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      '*::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '*::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#5F6368' : '#DADCE0',
        borderRadius: '8px',
      },
      '*::-webkit-scrollbar-thumb:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#9AA0A6' : '#BDC1C6',
      },
    }),
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        borderRadius: 24,
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
        boxShadow: 'none',
        border: '1px solid',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        boxShadow: 'none',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 24,
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '1px',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  typography,
  components,
  palette: {
    mode: 'light',
    aiGradient: 'linear-gradient(90deg, #4285f4, #d96570, #bc65d9, #131314)',
    primary: {
      main: '#4285F4',
      dark: '#1A73E8',
    },
    secondary: {
      main: '#EA4335',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F8F9FA',
    },
    text: {
      primary: '#1F1F1F',
      secondary: '#5F6368',
    },
    divider: '#E3E3E3',
  },
  shape: {
    borderRadius: 12,
  },
});

export const darkTheme = createTheme({
  typography,
  components,
  palette: {
    mode: 'dark',
    aiGradient: 'linear-gradient(90deg, #A8C7FA 0%, #F28B82 33%, #FDE293 66%, #81C995 100%)',
    primary: {
      main: '#A8C7FA',
    },
    secondary: {
      main: '#F28B82',
    },
    background: {
      default: '#131314',
      paper: '#1E1F20',
    },
    text: {
      primary: '#E3E3E3',
      secondary: '#9AA0A6',
    },
    divider: '#3C4043',
  },
  shape: {
    borderRadius: 12,
  },
});
