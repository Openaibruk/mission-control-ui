'use client';

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'dark' | 'light';

interface UseThemeReturn {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('mc-theme') as Theme;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mc-theme', next);
      return next;
    });
  }, []);

  return {
    theme,
    toggle,
    isDark: theme === 'dark',
  };
}

// Theme-aware class names helper
export function useThemeClasses(isDark: boolean) {
  return {
    bg: isDark ? 'bg-[#09090B]' : 'bg-[#FAFAFA]',
    card: isDark 
      ? 'bg-[#111113] border border-neutral-800 rounded-lg' 
      : 'bg-white border-neutral-200 rounded-lg',
    heading: isDark ? 'text-white' : 'text-neutral-900',
    muted: isDark ? 'text-neutral-400' : 'text-neutral-500',
    subtle: isDark ? 'text-neutral-500' : 'text-neutral-400',
    divider: isDark ? 'border-neutral-800' : 'border-neutral-200',
    inputBg: isDark 
      ? 'bg-neutral-900 border-neutral-700 text-white placeholder-neutral-500' 
      : 'bg-neutral-100 border-neutral-300 text-neutral-900 placeholder-neutral-400',
    hoverCard: isDark 
      ? 'hover:bg-neutral-800 hover:border-violet-500/30' 
      : 'hover:bg-neutral-50 hover:border-violet-300',
    progressBg: isDark ? 'bg-neutral-800' : 'bg-neutral-200',
  };
}