---
date: "2024-01-15"
time: "09:30"
title: "Setting up Astro for Static Site Generation"
tags: ["astro", "web-development", "static-sites"]
---

## User
I want to set up Astro for my daily conversation blog. What's the minimal setup I need?

## Assistant
Great choice! Astro is perfect for static sites. Here's the minimal setup:

1. **Initialize project:**
```bash
npm create astro@latest my-blog
cd my-blog
```

2. **Basic structure:**
- `src/pages/` for your routes
- `src/layouts/` for templates
- `src/components/` for reusable parts

3. **Key config:**
```js
// astro.config.mjs
export default defineConfig({
  output: 'static'
});
```

That's it! Astro handles Markdown automatically and builds to static HTML.

## User
How do I handle dynamic routes for dates?

## Assistant
Use Astro's file-based routing with brackets:

1. **Create:** `src/pages/[date].astro`
2. **Use getStaticPaths():**
```js
export async function getStaticPaths() {
  const posts = await Astro.glob('../content/**/*.md');
  return posts.map(post => ({
    params: { date: post.frontmatter.date }
  }));
}
```

This generates static pages for each date automatically!