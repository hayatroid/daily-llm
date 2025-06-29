# Daily LLM 用 Claude コマンド 🤖

## 利用可能なコマンド

### コンテンツ作成

- **`/new [トピック]`** - 新しい日次会話を作成
- **`/summarize [日付]`** - 日次サマリーを生成

## クイック使用法

### 新しい会話の作成

```bash
# 今日の新しい会話を開始
/new "Database Optimization"
```

作成ファイル: `src/content/daily/2025-06-29/003-database-optimization.md`

### サマリーの生成

```bash
# 今日のサマリーを生成
/summarize

# 特定日のサマリーを生成
/summarize 2025-06-29
```

作成・更新ファイル: `src/content/daily/2025-06-29/index.md`

## ワークフロー統合

### 典型的な日次ワークフロー

1. **会話開始**: 主要な議論ごとに `/new "トピック"` を使用
2. **会話記録**: 議論を進めながら会話の本質を抽出・再構築
3. **一日の終わり**: `/summarize` で日次インデックスを作成
4. **コミット**: CLAUDE.md ルールに従う - `npm run format && npm run lint` してからコミット

### コンテンツガイドライン

- CLAUDE.md frontmatter テンプレート（title, tags, description）に従う
- 適切なスペースで日英混在を使用
- 発見しやすさのために会話を適切にタグ付け
- 説明は簡潔だが情報豊富に保つ

## 維持されるファイル構造

```
src/content/daily/
├── YYYY-MM-DD/
│   ├── 001-first-topic.md      ← /new
│   ├── 002-second-topic.md     ← /new
│   ├── 003-third-topic.md      ← /new
│   └── index.md                ← /summarize
```

## コマンド機能

- **自動番号付け**: 次の会話番号を自動決定
- **テンプレート生成**: 一貫した frontmatter と構造
- **タグ統合**: サマリー用に会話間でタグをマージ
- **内容分析**: AI 駆動のサマリー生成
- **エラーハンドリング**: エッジケースの適切な処理
- **CLAUDE.md 準拠**: 全プロジェクト慣例に従う
