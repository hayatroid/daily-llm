import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://daily-llm.hayatro.id',
  output: 'static',
  build: {
    format: 'directory',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
