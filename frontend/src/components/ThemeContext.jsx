import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  default: {
    name: 'Default Blue',
    '--primary': '#0a66c2',
    '--primary-dark': '#084d94',
    '--secondary': '#f59e0b',
    '--dark': '#1a1a1a',
    '--gray': '#6b7280',
    '--light-gray': '#f3f4f6',
    '--white': '#ffffff',
    '--gradient': 'linear-gradient(135deg, #0a66c2 0%, #084d94 100%)',
    '--gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
  },
  gold: {
    name: 'China Gold',
    '--primary': '#B8860B',
    '--primary-dark': '#856404',
    '--secondary': '#DC143C',
    '--dark': '#1a1a1a',
    '--gray': '#6b7280',
    '--light-gray': '#f3f4f6',
    '--white': '#ffffff',
    '--gradient': 'linear-gradient(135deg, #B8860B 0%, #856404 100%)',
    '--gradient-accent': 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
  },
  dark: {
    name: 'Dark Mode',
    '--primary': '#60a5fa',
    '--primary-dark': '#3b82f6',
    '--secondary': '#fbbf24',
    '--dark': '#f9fafb',
    '--gray': '#d1d5db',
    '--light-gray': '#374151',
    '--white': '#1f2937',
    '--gradient': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    '--gradient-accent': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  },
  monochrome: {
    name: 'Black & White',
    '--primary': '#000000',
    '--primary-dark': '#1a1a1a',
    '--secondary': '#4b5563',
    '--dark': '#111827',
    '--gray': '#6b7280',
    '--light-gray': '#f3f4f6',
    '--white': '#ffffff',
    '--gradient': 'linear-gradient(135deg, #000000 0%, #374151 100%)',
    '--gradient-accent': 'linear-gradient(135deg, #4b5563 0%, #1f2937 100%)',
  },
  green: {
    name: 'Eco Green',
    '--primary': '#059669',
    '--primary-dark': '#047857',
    '--secondary': '#f59e0b',
    '--dark': '#1a1a1a',
    '--gray': '#6b7280',
    '--light-gray': '#f3f4f6',
    '--white': '#ffffff',
    '--gradient': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    '--gradient-accent': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'gold';
  });

  useEffect(() => {
    const theme = themes[currentTheme];
    Object.keys(theme).forEach(key => {
      if (key !== 'name') {
        document.documentElement.style.setProperty(key, theme[key]);
      }
    });
    localStorage.setItem('selectedTheme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);