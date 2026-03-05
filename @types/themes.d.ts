import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    aiGradient: string;
  }
  interface PaletteOptions {
    aiGradient?: string;
  }
}
