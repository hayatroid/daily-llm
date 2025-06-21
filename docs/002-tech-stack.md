# 🚀 Tech Stack

## 🎯 Goals

Build the core features with:
- Fast static site generation
- Markdown-based content
- CLI-inspired minimal design
- Simple deployment to GitHub Pages

## 🚫 Non-Goals

Features to consider later:
- Interactive terminal commands
- ASCII art and animations
- Sound effects
- Easter eggs
- Comments system
- Advanced search features

## 🛠️ Core Stack

### 📄 Static Site Generator: **Astro**
- Zero JS by default
- Fast builds
- Great Markdown support
- Easy GitHub Pages deployment

### 🎨 Styling: **Plain CSS** with Terminal Theme
```css
:root {
  --term-green: #00ff00;
  --term-bg: #0a0a0a;
  --term-text: #e0e0e0;
  font-family: 'JetBrains Mono', monospace;
}
```

### 📝 Content: **Markdown**
- Simple `.md` files
- Frontmatter for metadata
- No complexity needed

### 🏗️ Build: **npm** scripts
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

### 🌐 Hosting: **GitHub Pages**
- Free hosting for public repos
- Automatic deploys with GitHub Actions
- Custom domain support
- No server management needed

## 📦 Minimal Dependencies

```json
{
  "devDependencies": {
    "astro": "^4.0.0"
  }
}
```

That's it. No more. Ship it. 🚀