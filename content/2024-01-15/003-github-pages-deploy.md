---
date: '2024-01-15'
time: '16:45'
title: 'Deploying Astro to GitHub Pages'
tags: ['github-pages', 'deployment', 'ci-cd', 'astro']
---

## User

What's the GitHub Actions workflow for deploying Astro to GitHub Pages?

## Assistant

Here's the complete workflow for `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

## User

Do I need any special Astro config for GitHub Pages?

## Assistant

Yes! Update your `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://username.github.io',
  base: '/repository-name',
  output: 'static',
  build: {
    format: 'directory',
  },
});
```

Make sure to enable GitHub Pages in your repo settings and set the source to "GitHub Actions"!
