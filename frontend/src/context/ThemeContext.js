import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function resolveTheme(themePref) {
  if (themePref === 'dark' || themePref === 'light') return themePref === 'dark';
  if (themePref === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export const ThemeProvider = ({ children }) => {
  const [themePref, setThemePref] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user_preferences'));
      return saved?.theme || localStorage.getItem('theme') || 'system';
    } catch { return localStorage.getItem('theme') || 'system'; }
  });

  const [dark, setDark] = useState(() => resolveTheme(themePref));

  useEffect(() => {
    setDark(resolveTheme(themePref));
    if (themePref === 'system') {
      localStorage.setItem('theme', 'system');
    } else {
      localStorage.setItem('theme', themePref);
    }
  }, [themePref]);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  useEffect(() => {
    if (themePref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [themePref]);

  const toggle = () => {
    setThemePref(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (pref) => setThemePref(pref);

  return (
    <ThemeContext.Provider value={{ dark, toggle, setTheme, themePref }}>
      {children}
    </ThemeContext.Provider>
  );
};
