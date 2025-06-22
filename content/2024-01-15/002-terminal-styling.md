---
title: 'Creating a Terminal-Inspired Design'
tags: ['css', 'design', 'terminal', 'monospace']
outcome: 'ターミナル風テーマ作成'
---

## User

I want my blog to look like a terminal. What CSS variables should I use?

## Assistant

Perfect! Here's a clean terminal theme:

```css
:root {
  --term-bg: #0a0a0a;
  --term-green: #00ff00;
  --term-amber: #ffb000;
  --term-text: #e0e0e0;
  --term-gray: #666666;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

body {
  background: var(--term-bg);
  color: var(--term-text);
  line-height: 1.6;
}

.prompt {
  color: var(--term-green);
}

.command {
  color: var(--term-amber);
}
```

## User

Should I add any animations?

## Assistant

Keep it minimal for now! Maybe just:

```css
.cursor::after {
  content: '▊';
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
```

Focus on getting the content structure right first. Animations are nice-to-have!
