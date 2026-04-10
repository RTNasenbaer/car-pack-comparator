import React, { createContext, useState, useEffect, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  introductionSeen: boolean;
  setIntroductionSeen: (seen: boolean) => void;
  effectiveTheme: 'light' | 'dark';
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

  const [introductionSeen, setIntroductionSeenState] = useState<boolean>(() => {
    const savedIntro = localStorage.getItem('introductionSeen');
    return savedIntro === 'true';
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setIntroductionSeen = (seen: boolean) => {
    setIntroductionSeenState(seen);
    localStorage.setItem('introductionSeen', seen.toString());
  };

  const effectiveTheme = useMemo(() => {
    if (theme !== 'system') {
      return theme;
    }
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    return mediaQuery.matches ? 'dark' : 'light';
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme);
  }, [effectiveTheme]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    introductionSeen,
    setIntroductionSeen,
    effectiveTheme,
  }), [theme, introductionSeen, effectiveTheme]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
