# 📝 Daily AI Conversations - Project Overview

## 🎯 Goals

Build a system that:

- [x] 💬 Records daily conversations with AI
- [x] 📄 Creates summaries automatically
- [x] 🌐 Publishes everything as a website

## 🚫 Non-Goals

- [x] Choosing specific technologies (covered in 002-tech-stack.md)
- [x] Implementation details (covered in 003-implementation-plan.md)
- [x] Visual design details (implemented terminal theme)

## ✨ Main Features

### 1. 💬 Save Conversations

- [x] Store AI chats as Markdown files
- [x] Easy-to-read format with frontmatter
- [x] Organized by date (`content/YYYY-MM-DD/`)

### 2. 📝 Create Daily Summaries

- [x] Read all conversations from the day
- [x] Use AI to make a summary
- [x] Save as a single summary file (`summary.md`)

### 3. 🌐 Publish to Web

- [x] Show conversations and summaries by date
- [ ] Add search to find topics (deferred - Non-Goal)
- [ ] Use tags to organize content (basic tags implemented, advanced filtering deferred)

## 📁 Directory Structure

```
daily-llm/
├── content/              # 💬 All conversations and summaries
│   ├── 2024-01-01/      # 📅 One folder per day
│   │   ├── 001-web-development.md
│   │   ├── 002-ai-integration.md
│   │   └── summary.md   # 📝 Daily summary
│   └── ...
├── src/                  # 🔧 Website code
├── public/               # 🖼️ Images and assets
└── docs/                 # 📚 Project documentation
```

## 🔄 Workflow

### 1. 💬 Recording Conversations

- [x] Save each AI chat as Markdown
- [x] Name files: `001-[topic].md`, `002-[topic].md`, etc.
- [x] Store in: `content/YYYY-MM-DD/`
- [x] Use frontmatter for metadata (date, time, title, tags)

### 2. 📝 Making Summaries

- [x] Read all conversation files from the day
- [x] Ask AI to create a summary
- [x] Save as `content/YYYY-MM-DD/summary.md`
- [x] Include highlights and key takeaways

### 3. 🌐 Publishing Online

- [x] Display conversations and summaries by date
- [x] Automatic build and deployment via GitHub Actions
- [x] Custom domain support (`daily-llm.hayatro.id`)
- [ ] Let people search for topics (deferred)
- [ ] Advanced tag filtering (deferred)
