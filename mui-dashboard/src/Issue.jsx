import React, { useState } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import College from './components/college'

export default function App() {
  const [mode, setMode] = useState('light');
  const theme = createTheme({ palette: { mode } });

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <College toggleTheme={toggleTheme} mode={mode} />
    </ThemeProvider>
  );
}
