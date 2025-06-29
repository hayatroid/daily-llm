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
description: '[Brief description of the conversation topic and approach]'
---
```

**Summary:**

```markdown
---
title: '[Summary title]'
tags: ['tag1', 'tag2']
description: '[Overview of the day's discussions and main topics covered]'
---
```

**Frontmatter Strategy:**

- ✅ **Core fields:** `title`, `tags`, `description` for all content
- 📍 **Rationale:** Provides context for discovery and understanding while keeping structure simple

**日英混在文の書式ルール:**

- 英単語の前後に半角スペースを必ず挿入
- 例: `Reactアプリケーション` → `React アプリケーション`
- 例: `Dockerコンテナ` → `Docker コンテナ`
- 例: `API設計` → `API 設計`

**Core Principle:** Core first, adventure later! 🚀

## 🤖 Claude Commands

**コンテンツ作成:**

```bash
/new "Topic"        # 新しい会話を作成
/summarize [date]   # 日次サマリーを生成
```

**クイックワークフロー:**

1. `/new "Database Optimization"` → `003-database-optimization.md` を作成
2. 会話の本質を抽出・再構築して記録
3. `/summarize` → AI サマリーで `index.md` を作成・更新
4. 上記ルールに従って format & commit

**Command Details:** See `.claude/commands/README.md`
