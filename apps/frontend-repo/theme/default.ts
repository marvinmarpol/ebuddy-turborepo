'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
});

export default theme;
