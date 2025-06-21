# 🚀 Tech Stack

## 🎯 Goals

Build the core features with:

- [x] Fast static site generation
- [x] Markdown-based content
- [x] CLI-inspired minimal design
- [x] Simple deployment to GitHub Pages

## 🚫 Non-Goals

Features to consider later:

- [ ] Interactive terminal commands
- [ ] ASCII art and animations
- [ ] Sound effects
- [ ] Easter eggs
- [ ] Comments system
- [ ] Advanced search features

## 🛠️ Core Stack

### 📄 Static Site Generator: **Astro**

- [x] Zero JS by default
- [x] Fast builds
- [x] Great Markdown support
- [x] Easy GitHub Pages deployment

### 🎨 Styling: **Plain CSS** with Terminal Theme

- [x] Terminal color scheme implemented
- [x] JetBrains Mono font family
- [x] CSS custom properties
- [x] Responsive design

```css
:root {
  --term-green: #00ff00;
  --term-bg: #0a0a0a;
  --term-text: #e0e0e0;
  --term-gray: #666666;
  --term-amber: #ffb000;
  font-family: 'JetBrains Mono', monospace;
}
```

### 📝 Content: **Markdown**

- [x] Simple `.md` files
- [x] Frontmatter for metadata
- [x] Dynamic content rendering
- [x] Content components (ConversationCard, SummaryCard)

### 🏗️ Build: **npm** scripts

- [x] Development server
- [x] Production build
- [x] Code quality checks
- [x] Formatting and linting

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "lint": "eslint . --ext .astro,.js,.mjs",
    "format": "prettier --write ."
  }
}
```

### 🌐 Hosting: **GitHub Pages**

- [x] Free hosting for public repos
- [x] Automatic deploys with GitHub Actions
- [x] Custom domain support configured
- [x] No server management needed
- [x] DNS propagation completed
- [x] Live deployment verified

## 📦 Dependencies

### Core

```json
{
  "dependencies": {
    "astro": "^4.15.12"
  }
}
```

### Code Quality (Added for maintainability)

```json
{
  "devDependencies": {
    "@typescript-eslint/parser": "^8.34.1",
    "eslint": "^9.29.0",
    "eslint-plugin-astro": "^1.3.1",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "prettier": "^3.5.3"
  }
}
```

- [x] Minimal core dependencies
- [x] Code quality tools added
- [x] ESLint + Prettier configuration
- [x] CI/CD integration

Shipped! 🚀
