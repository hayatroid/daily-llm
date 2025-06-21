# 🛠️ Implementation Plan

## 🎯 Goals

Define the concrete details needed to start building:
- Markdown frontmatter structure
- Page layouts and routes
- URL structure
- Deployment workflow

## 🚫 Non-Goals

- Complex features (search, tags, etc.)
- Multiple themes
- Internationalization
- Analytics

## 📄 Content Format

### Conversation Markdown Structure
```markdown
---
date: 2024-01-01
time: "14:30"
title: "Web Development Best Practices"
tags: ["web", "javascript", "astro"]
---

## User
How do I optimize my Astro site for performance?

## Assistant
Here are the key performance optimizations...
```

### Summary Markdown Structure
```markdown
---
date: 2024-01-01
conversations: 3
highlights:
  - "Discussed Astro performance"
  - "Explored CSS architecture"
  - "Reviewed deployment options"
---

# Daily Summary - January 1, 2024

Today's conversations covered web development topics...
```

## 🗺️ Page Structure

### 1. **Home Page** (`/`)
- Show all summaries (latest first)
- Links to daily pages
- Simple terminal-style header

### 2. **Daily Page** (`/2024-01-01/`)
- Display all conversations from that day
- Show summary at the top
- Navigation to prev/next day

## 🔗 URL Structure

```
/                           # Home (all summaries)
/2024-01-01/                # Daily page (direct date mapping)
```

## 📁 Project Structure

```
daily-llm/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Home page (all summaries)
│   │   └── [date].astro        # Dynamic daily pages
│   ├── layouts/
│   │   └── BaseLayout.astro     # Main layout
│   ├── components/
│   │   ├── Header.astro         # Site header
│   │   ├── ConversationCard.astro
│   │   └── SummaryCard.astro
│   └── styles/
│       └── terminal.css         # Terminal theme
├── content/                     # Markdown files
├── public/
│   └── favicon.ico
├── astro.config.mjs
└── package.json
```

## 🚀 GitHub Actions Workflow

### `.github/workflows/deploy.yml`
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

## ⚙️ Astro Configuration

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://[username].github.io',
  base: '/daily-llm',
  output: 'static',
  build: {
    format: 'directory'
  }
});
```

## 📝 Next Steps

1. Initialize Astro project
2. Create base layout with terminal styling
3. Build home page component
4. Implement dynamic routing for daily pages
5. Set up GitHub Actions
6. Deploy to GitHub Pages