import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://daily-llm.hayatro.id',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
