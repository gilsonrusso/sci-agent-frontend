import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeContext } from '../theme/ThemeContext';

export default function ThemeToggle() {
  const theme = useTheme();
  const { toggleColorMode } = useThemeContext();

  return (
    <IconButton onClick={toggleColorMode} color='inherit' sx={{ ml: 1 }}>
      {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
