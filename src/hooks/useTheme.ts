'use client';

import { useMemo } from 'react';
import { ThemeClasses, getThemeClasses } from '@/lib/utils';

export function useThemeClasses(isDark: boolean): ThemeClasses {
  return useMemo(() => getThemeClasses(isDark), [isDark]);
}
