# 🤖 Claude Development Guide

## 📋 Quick Rules

**Code Quality (MANDATORY):**

```bash
npm run format && npm run lint
```

Must pass before every commit. **This includes documentation changes** - always run formatter even for .md file edits.

**Directory Structure:**

- `content/YYYY-MM-DD/` - Daily conversations
- `docs/` - Project specifications
- Files: `001-topic.md`, `002-topic.md`, `summary.md`

**Commit Messages:**

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation
- `refactor:` code restructuring

## 🔄 PIR Workflow (Complex Features)

**📋 Planning → 🛠️ Implementation → 📊 Review**

1. **Plan:** Create `docs/XXX-feature-plan.md` with Goals/Non-Goals
2. **Implement:** Use TodoWrite, follow plan systematically
3. **Review:** Update plan with `[x]` completed items + metrics

**Commit Convention:**

```bash
docs(plan): add [feature] implementation plan
feat(planned): implement [feature] as documented
docs(review): update [feature] plan with results
```

## 📝 Documentation Pattern

Every `docs/` file starts with:

```markdown
## 🎯 Goals

- What to build now
- Core requirements

## 🚫 Non-Goals

- What to defer
- Future enhancements
```

Convert to checklists during implementation:

- `[x]` completed
- `[ ]` pending/deferred

## 🚀 Content Templates

**Conversation:**

```markdown
---
date: 2024-MM-DD
time: 'HH:MM'
title: '[Topic]'
tags: ['tag1', 'tag2']
---
```

**Summary:**

```markdown
---
date: 2024-MM-DD
conversations: [NUMBER]
highlights:
  - '[Key insight]'
  - '[Technical decision]'
---
```

**Core Principle:** Core first, adventure later! 🚀
