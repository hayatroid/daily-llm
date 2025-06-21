# 📝 Daily AI Conversations - Project Overview

## 🎯 Goals

Build a system that:

- 💬 Records daily conversations with AI
- 📄 Creates summaries automatically
- 🌐 Publishes everything as a website

## 🚫 Non-Goals

- Choosing specific technologies (covered in another doc)
- Implementation details
- Visual design details

## ✨ Main Features

### 1. 💬 Save Conversations

- Store AI chats as Markdown files
- Easy-to-read format
- Organized by date

### 2. 📝 Create Daily Summaries

- Read all conversations from the day
- Use AI to make a summary
- Save as a single summary file

### 3. 🌐 Publish to Web

- Show conversations and summaries by date
- Add search to find topics
- Use tags to organize content

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

- Save each AI chat as Markdown
- Name files: `001-[topic].md`, `002-[topic].md`, etc.
- Store in: `content/YYYY-MM-DD/`

### 2. 📝 Making Summaries

1. Read all conversation files from the day
2. Ask AI to create a summary
3. Save as `content/YYYY-MM-DD/summary.md`

### 3. 🌐 Publishing Online

- Display conversations and summaries by date
- Let people search for topics
- Use tags to find related content
