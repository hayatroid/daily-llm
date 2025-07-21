export function applyTheme(preference: 'light' | 'dark' | 'system') {
  const resolved =
    preference === 'system'
      ? matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : preference;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  localStorage.setItem('theme', preference);
}

// Listen for system theme changes
matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  const pref = localStorage.getItem('theme');
  if (pref === 'system') {
    document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
  }
});
