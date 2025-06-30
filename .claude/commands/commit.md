# /commit 📝

## 目的

すべての品質チェックを通してから安全に commit を作成する

## 使い方

`/commit [コミットメッセージの概要]`

## 実行手順 📋

### Phase 1: 品質チェック (Quality Check)

1. **現状確認**:

   - `git status` で変更ファイル全体を確認
   - `git diff` で変更内容全体を確認
   - 変更全体の意図と整合性を検証
   - 意図しない変更やファイルがないことを確認

2. **フォーマット・lint チェック**:

   - `npm run format && npm run lint` を実行
   - エラーがある場合は修正して再実行
   - すべてのフォーマット・lint 問題が解決されるまで継続

3. **textlint チェック** (content ファイルが変更されている場合):

   - `npm run textlint` を実行（CI と同じ対象: `src/content/**/*.md`）
   - 日本語文章品質の問題があれば修正
   - すべての textlint 問題が解決されるまで継続

4. **ビルドテスト**:
   - `npm run build` でビルドが成功することを確認
   - ビルドエラーがある場合は修正して再実行

### Phase 2: コミット作成 (Commit Creation)

1. **コミットメッセージ作成**:

   - `git status` と `git diff` で確認した変更全体を分析
   - 提供された概要と実際の変更内容を照合し、変更全体を表現するメッセージを構築
   - 変更全体の性質を分析して適切なプレフィックスを選択 (feat:, fix:, content:, etc.)
   - 複数の変更がある場合は主要な変更を軸に全体を簡潔に表現

2. **段階的コミット**:

   - `git add .` で変更をステージング
   - 適切なコミットメッセージでコミット実行
   - 標準フッター付与 (Claude Code 生成表記)

3. **コミット確認**:
   - `git log --oneline -1` でコミットが正常に作成されたことを確認
   - `git status` で working tree がクリーンになったことを確認

## コミットメッセージ形式 📏

```
<type>: <subject>

<body>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Type 一覧

- **feat**: 新機能追加
- **fix**: バグ修正・問題解決
- **content**: 記事・コンテンツ追加
- **refactor**: リファクタリング
- **docs**: ドキュメント変更
- **style**: フォーマット変更
- **test**: テスト関連
- **ci**: CI/CD 設定変更
- **chore**: その他の変更

## エラーハンドリング 🛡️

- **フォーマット・lint エラー**: 自動修正可能なものは修正、手動対応が必要なものは明示
- **textlint エラー**: 具体的な修正提案を行い、ユーザーと協議
- **ビルドエラー**: エラー内容を分析し、修正方法を提案
- **コミット失敗**: 原因を特定し、解決策を提示

## 実行例 💫

```bash
# 入力
/commit "記事追加と new コマンド改善"

# プロセス
1. 品質チェック:
   - git status, git diff で変更確認
   - npm run format && npm run lint (正常完了)
   - npm run textlint (正常完了)
   - npm run build (正常完了)

2. コミット作成:
   - 変更全体の分析: 記事1件追加 + /new コマンド改善 + ダミーサマリー追加
   - Type: content (記事追加がメイン変更)
   - Subject: add development dilemma article and improve /new command
   - Body: 変更全体の詳細説明

# 出力
Commit created: abc1234 content: add development dilemma article and improve /new command
Working tree clean
```

## 成功の基準 🎯

- ✅ すべての品質チェックが正常完了
- ✅ フォーマット・lint 問題がすべて解決
- ✅ textlint 問題がすべて解決 (content ファイルが変更されている場合)
- ✅ ビルドが正常に成功
- ✅ 適切なコミットメッセージが作成された
- ✅ コミットが正常に作成された
- ✅ working tree がクリーンになった
- ✅ 標準フッターが適切に付与された
