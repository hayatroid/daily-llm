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
title: '[Topic]'
tags: ['tag1', 'tag2']
outcome: '[Concrete result achieved]'
---
```

**Summary:**

```markdown
---
title: '[Summary title]'
tags: ['tag1', 'tag2']
outcomes:
  - '[Key result 1]'
  - '[Key result 2]'
---
```

**Frontmatter Strategy Change (2024-12-22):**

- ❌ **Removed:** `date`, `time`, `conversations` fields (redundant with file path/structure)
- ✅ **Added:** `outcome`/`outcomes` fields showing concrete results achieved
- 📍 **Rationale:** Focus on meaningful information (what was accomplished) rather than metadata (when/how many)

**日英混在文の書式ルール:**

- 英単語の前後に半角スペースを必ず挿入
- 例: `Reactアプリケーション` → `React アプリケーション`
- 例: `Dockerコンテナ` → `Docker コンテナ`
- 例: `API設計` → `API 設計`

**Core Principle:** Core first, adventure later! 🚀
