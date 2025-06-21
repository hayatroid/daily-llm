# 🤖 Claude Development Guide

## 📋 Documentation Philosophy

### Goals/Non-Goals Pattern
Every document in `docs/` should start with:
1. **Goals** - What this document covers
2. **Non-Goals** - What to defer for later

This helps:
- Focus on core functionality first
- Avoid scope creep
- Ship faster
- Document what we're NOT doing

### Example Structure
```markdown
# Document Title

## 🎯 Goals
- Core features to implement now
- Essential decisions to make

## 🚫 Non-Goals
- Nice-to-have features
- Future enhancements
- Complex optimizations
```

Remember: **Core first, adventure later!** 🚀

## 🚀 Project Specific Notes

### Directory Structure
- All conversations go in `content/YYYY-MM-DD/`
- Name files as `001-[topic].md`, `002-[topic].md`, etc.
- Daily summaries saved as `summary.md`

### Documentation
- Project specs in `docs/001-project-overview.md`
- Technical details in separate numbered docs

## 📝 Content Creation

### Daily Conversation Format
Use this prompt template to generate conversation files:

```
Create a realistic conversation between User and Assistant about [TOPIC].
Format as Markdown with this frontmatter:

---
date: 2024-MM-DD
time: "HH:MM"
title: "[Descriptive Title]"
tags: ["tag1", "tag2", "tag3"]
---

Requirements:
- 2-4 exchanges (User -> Assistant -> User -> Assistant)
- Technical but accessible language
- Include code examples when relevant
- Keep responses helpful and concise
- Topics: web development, AI, programming, tools
```

### Daily Summary Format
Use this prompt template for summary files:

```
Create a daily summary based on these conversations: [LIST_CONVERSATIONS]

Format as Markdown with this frontmatter:

---
date: 2024-MM-DD
conversations: [NUMBER]
highlights:
  - "[Key insight 1]"
  - "[Key insight 2]"
  - "[Key insight 3]"
---

Requirements:
- 2-3 paragraphs max
- Focus on key learnings and insights
- Mention specific technical decisions
- End with "Key Takeaways" bullet points
- Forward-looking final sentence
```

## 📝 Commit Rules

### Commit Message Format
```
<type>: <description>

[optional body]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc)
- `refactor`: Code refactoring
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Examples
- `feat: add daily conversation recording`
- `docs: create project overview`
- `fix: correct markdown formatting`

### Guidelines
1. Use present tense ("add" not "added")
2. Keep first line under 50 characters
3. Capitalize first letter
4. No period at the end of subject line
5. Use imperative mood ("add" not "adds")
