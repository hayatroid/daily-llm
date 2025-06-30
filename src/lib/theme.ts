// Centralized theme management utilities

export type Theme = 'light' | 'dark';

export const ThemeManager = {
  // Get theme from localStorage or system preference
  getTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';

    // Check localStorage first
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;

    // Fall back to system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }

    return 'dark';
  },

  // Set theme and persist to localStorage
  setTheme(theme: Theme): void {
    if (typeof window === 'undefined') return;

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  // Toggle between light and dark themes
  toggleTheme(): Theme {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
    return newTheme;
  },

  // Get current theme from DOM
  getCurrentTheme(): Theme {
    if (typeof window === 'undefined') return 'dark';
    return (
      (document.documentElement.getAttribute('data-theme') as Theme) || 'dark'
    );
  },
};
