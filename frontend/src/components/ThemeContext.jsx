import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'blue';
  });

  const themes = {
    blue: {
      name: 'Blue Ocean',
      '--primary': '#0a66c2',
      '--primary-dark': '#084d94',
      '--primary-light': '#2d8fd8',
      '--secondary': '#f59e0b',
      '--secondary-dark': '#d97706',
      '--dark': '#1a1a1a',
      '--gray': '#6b7280',
      '--light-gray': '#f3f4f6',
      '--white': '#ffffff',
      '--background': '#ffffff',
      '--surface': '#f9fafb',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#6b7280',
      '--gradient': 'linear-gradient(135deg, #0a66c2 0%, #084d94 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
      '--shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      '--shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.15)'
    },
    gold: {
      name: 'China Gold',
      '--primary': '#B8860B',
      '--primary-dark': '#856404',
      '--primary-light': '#DAA520',
      '--secondary': '#DC143C',
      '--secondary-dark': '#8B0000',
      '--dark': '#1a1a1a',
      '--gray': '#6b7280',
      '--light-gray': '#f3f4f6',
      '--white': '#ffffff',
      '--background': '#fffef8',
      '--surface': '#faf8f0',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#6b7280',
      '--gradient': 'linear-gradient(135deg, #B8860B 0%, #856404 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
      '--shadow': '0 4px 6px rgba(184, 134, 11, 0.2)',
      '--shadow-lg': '0 10px 25px rgba(184, 134, 11, 0.25)'
    },
    green: {
      name: 'Green Forest',
      '--primary': '#059669',
      '--primary-dark': '#047857',
      '--primary-light': '#10b981',
      '--secondary': '#d97706',
      '--secondary-dark': '#b45309',
      '--dark': '#1a1a1a',
      '--gray': '#6b7280',
      '--light-gray': '#f3f4f6',
      '--white': '#ffffff',
      '--background': '#ffffff',
      '--surface': '#f0fdf4',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#6b7280',
      '--gradient': 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      '--shadow': '0 4px 6px rgba(5, 150, 105, 0.2)',
      '--shadow-lg': '0 10px 25px rgba(5, 150, 105, 0.25)'
    },
    purple: {
      name: 'Purple Dream',
      '--primary': '#7c3aed',
      '--primary-dark': '#6d28d9',
      '--primary-light': '#8b5cf6',
      '--secondary': '#ec4899',
      '--secondary-dark': '#db2777',
      '--dark': '#1a1a1a',
      '--gray': '#6b7280',
      '--light-gray': '#f3f4f6',
      '--white': '#ffffff',
      '--background': '#ffffff',
      '--surface': '#faf5ff',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#6b7280',
      '--gradient': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      '--shadow': '0 4px 6px rgba(124, 58, 237, 0.2)',
      '--shadow-lg': '0 10px 25px rgba(124, 58, 237, 0.25)'
    },
    red: {
      name: 'Red Passion',
      '--primary': '#dc2626',
      '--primary-dark': '#b91c1c',
      '--primary-light': '#ef4444',
      '--secondary': '#ea580c',
      '--secondary-dark': '#c2410c',
      '--dark': '#1a1a1a',
      '--gray': '#6b7280',
      '--light-gray': '#f3f4f6',
      '--white': '#ffffff',
      '--background': '#ffffff',
      '--surface': '#fef2f2',
      '--text-primary': '#1a1a1a',
      '--text-secondary': '#6b7280',
      '--gradient': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
      '--shadow': '0 4px 6px rgba(220, 38, 38, 0.2)',
      '--shadow-lg': '0 10px 25px rgba(220, 38, 38, 0.25)'
    },
    dark: {
      name: 'Dark Mode',
      '--primary': '#3b82f6',
      '--primary-dark': '#2563eb',
      '--primary-light': '#60a5fa',
      '--secondary': '#f59e0b',
      '--secondary-dark': '#d97706',
      '--dark': '#ffffff',
      '--gray': '#9ca3af',
      '--light-gray': '#1f2937',
      '--white': '#111827',
      '--background': '#0f172a',
      '--surface': '#1e293b',
      '--text-primary': '#f9fafb',
      '--text-secondary': '#d1d5db',
      '--gradient': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      '--gradient-accent': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      '--shadow': '0 4px 6px rgba(0, 0, 0, 0.5)',
      '--shadow-lg': '0 10px 25px rgba(0, 0, 0, 0.7)'
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    // Apply all CSS variables
    Object.keys(theme).forEach(key => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, theme[key]);
      }
    });

    // Apply background color to body
    document.body.style.backgroundColor = theme['--background'];
    document.body.style.color = theme['--text-primary'];

    // Save to localStorage
    localStorage.setItem('theme', currentTheme);

    // Add transition class for smooth theme changes
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

  }, [currentTheme]);

  const value = {
    currentTheme,
    setCurrentTheme,
    themes,
    isDarkMode: currentTheme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
