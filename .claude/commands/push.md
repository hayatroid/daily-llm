# /push 🚀

## 目的

品質チェックを通してから安全にコミットを作成し、リモートリポジトリにプッシュする (husky pre-commit フックのラッパー)

## 使い方

`/push [コミットメッセージの概要]`

## 実行手順 📋

### Phase 1: コミットメッセージ作成とコミット試行

1. **現状確認**:
   - `git status` で変更ファイル全体を確認
   - `git diff` で変更内容全体を確認
   - 変更全体の意図と整合性を検証

2. **コミットメッセージ作成**:
   - 提供された概要と実際の変更内容を照合
   - 変更全体の性質を分析して適切なプレフィックスを選択 (feat:, fix:, content:, etc.)
   - 複数の変更がある場合は主要な変更を軸に全体を簡潔に表現

3. **コミット実行**:
   - `git add .` で変更をステージング
   - 適切なコミットメッセージでコミット実行
   - 標準フッター付与 (Claude Code 生成表記)

### Phase 2: 品質チェックエラー対応 (必要時のみ)

husky の pre-commit フックが品質チェックを実行します：

- フォーマット・lint チェック
- textlint チェック (content ファイル変更時)
- ビルドテスト

エラーが発生した場合：

1. **エラー分析**:
   - フック実行結果を分析
   - 修正が必要な箇所を特定

2. **自動修正とリトライ**:
   - 自動修正可能な問題は修正
   - 手動修正が必要な場合は、ユーザーと協議して修正
   - 修正後、再度コミットを実行

### Phase 3: プッシュ実行

1. **プッシュ実行**:
   - `git push origin main` (または現在のブランチ)を実行
   - プッシュが正常に完了することを確認

2. **プッシュ確認**:
   - コミットが正常にリモートに反映されたことを確認

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

- **pre-commit フックエラー**: 自動修正可能なものは修正、手動対応が必要なものは明示
- **コミット失敗**: 原因を特定し、解決策を提示
- **プッシュエラー**: ネットワークエラーや権限エラーの対処法を提示

## 実行例 💫

```bash
# 入力
/push "記事追加とコマンド改善"

# プロセス
1. 変更確認:
   - git status, git diff で変更確認
   - 変更全体の分析

2. コミット試行:
   - git add .
   - git commit -m "content: add article and improve commands..."

3. pre-commit フック実行 (husky):
   - ❌ Format/lint エラー発生

4. エラー修正とリトライ:
   - 自動修正を実行
   - 再度 git commit を実行
   - ✅ 品質チェック通過

5. プッシュ実行:
   - git push origin main (正常完了)

# 出力
Commit created: abc1234 content: add article and improve commands
Working tree clean
Push successful
```

## 成功の基準 🎯

- ✅ 適切なコミットメッセージが作成された
- ✅ husky pre-commit フックの品質チェックが通過
- ✅ コミットが正常に作成された
- ✅ working tree がクリーンになった
- ✅ 標準フッターが適切に付与された
- ✅ プッシュが正常に完了
- ✅ リモートリポジトリに変更が正常反映
