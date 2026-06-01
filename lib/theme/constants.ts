export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'tucoach-theme';

export function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark';
}

export function resolveTheme(stored: string | null): Theme {
  if (isTheme(stored)) return stored;
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}

export function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
