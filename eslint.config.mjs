import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/semi': ['error', 'always'],
      'astro/prefer-class-list-directive': 'warn',
    },
  },
];