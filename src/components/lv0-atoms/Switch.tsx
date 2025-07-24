import { type Component, createSignal, onMount, For } from 'solid-js';
import { applyTheme } from '../../lib/theme';

type ThemeOption = 'dark' | 'light' | 'system';

interface ThemeFlag {
  name: string;
  value: ThemeOption;
}

const Switch: Component = () => {
  const [currentTheme, setCurrentTheme] = createSignal<ThemeOption>('system');

  const themeFlags: ThemeFlag[] = [
    { name: '--dark', value: 'dark' },
    { name: '--light', value: 'light' },
    { name: '--system', value: 'system' },
  ];

  onMount(() => {
    // Get initial theme from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as ThemeOption | null;
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }

    // Listen to theme changes via data attribute
    const observer = new MutationObserver(() => {
      const themePreference = document.documentElement.dataset
        .themePreference as ThemeOption;
      if (themePreference) {
        setCurrentTheme(themePreference);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-preference'],
    });

    return () => observer.disconnect();
  });

  const handleThemeChange = (theme: ThemeOption) => {
    applyTheme(theme);
    setCurrentTheme(theme);
  };

  return (
    <div class="flex flex-col gap-xs items-end">
      <For each={themeFlags}>
        {(flag) => (
          <button
            class="bg-transparent border-none p-0 flex gap-xs font-mono text-normal text-term-text hover:underline cursor-pointer"
            onClick={() => handleThemeChange(flag.value)}
          >
            <span>{flag.name}</span>
            <span>{currentTheme() === flag.value ? '[x]' : '[ ]'}</span>
          </button>
        )}
      </For>
    </div>
  );
};

export default Switch;
