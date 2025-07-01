// ========== TYPES ==========
export type Theme = 'light' | 'dark';

// ========== THEME MANAGER ==========
export const ThemeManager = {
  getTheme: (): Theme => {
    if (typeof window === 'undefined') return 'dark';

    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;

    return window.matchMedia?.('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  },

  setTheme: (theme: Theme): void => {
    if (typeof window === 'undefined') return;

    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  toggle: (): Theme => {
    const current = ThemeManager.getTheme();
    const newTheme: Theme = current === 'light' ? 'dark' : 'light';
    ThemeManager.setTheme(newTheme);
    return newTheme;
  },

  init: (): void => {
    if (typeof window === 'undefined') return;

    ThemeManager.setTheme(ThemeManager.getTheme());

    // Handle both old and new theme switcher formats
    document.getElementById('theme-toggle')?.addEventListener('click', () => {
      ThemeManager.toggle();
    });

    // Handle flag-based theme switcher
    document.querySelectorAll('.flag').forEach((button) => {
      button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme') as Theme;
        if (theme) {
          ThemeManager.setTheme(theme);
        }
      });
    });
  },
};
