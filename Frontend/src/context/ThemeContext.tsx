import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  scanlinesActive: boolean;
  toggleScanlines: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(() => {
    const saved = window.localStorage.getItem('sys_terminal_scanlines');
    return saved ? saved === 'true' : true;
  });

  useEffect(() => {
    window.localStorage.setItem('sys_terminal_scanlines', String(scanlinesActive));
    const root = document.documentElement;
    if (scanlinesActive) {
      root.classList.add('scanlines-enabled');
    } else {
      root.classList.remove('scanlines-enabled');
    }
  }, [scanlinesActive]);

  const toggleScanlines = () => setScanlinesActive(prev => !prev);

  return (
    <ThemeContext.Provider value={{ scanlinesActive, toggleScanlines }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme execution requires a valid wrapping ThemeProvider context bubble.');
  }
  return context;
};