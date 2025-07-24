/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        term: {
          green: 'var(--term-green)',
          blue: 'var(--term-blue)',
          bg: 'var(--term-bg)',
          link: 'var(--term-link)',
          text: 'var(--term-text)',
        },
      },
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        section: 'var(--space-section)',
        char: '1ch',
        prompt: 'var(--prompt-spacing)',
        'tree-indent': 'var(--tree-indent)',
      },
      fontSize: {
        normal: 'var(--text-normal)',
        small: 'var(--text-small)',
        lg: 'var(--text-lg)',
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      maxWidth: {
        container: 'var(--container-width)',
      },
      animation: {
        blink: 'blink var(--duration-blink) steps(1, start) infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
      },
      screens: {
        mobile: { max: '767px' },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
