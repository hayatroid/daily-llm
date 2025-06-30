# /commit-fast ⚡

## 目的

品質チェックを省略して迅速に commit を作成する

## 使い方

`/commit-fast [コミットメッセージの概要]`

## 実行手順 📋

### Phase 1: 現状確認 (Status Check)

1. **現状確認**:
   - `git status` で変更ファイル全体を確認
   - `git diff` で変更内容全体を確認
   - 変更全体の意図と整合性を検証
   - 意図しない変更やファイルがないことを確認

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

## 省略される品質チェック ⚠️

以下の品質チェックは実行されません：

- ❌ `npm run format && npm run lint`
- ❌ `npm run textlint`
- ❌ `npm run build`

## 注意事項 ⚠️

- **開発中の迅速な反復用途**: 小さな変更やWIP コミット用
- **品質チェック省略**: フォーマット、lint、textlint、ビルドテストは実行されない
- **CI での検証**: 最終的な品質チェックは CI で実行される
- **本格運用前**: 本格的なコミット前には `/commit` を使用することを推奨

## 実行例 💫

```bash
# 入力
/commit-fast "nav gap 調整"

# プロセス
1. 現状確認:
   - git status, git diff で変更確認

2. コミット作成:
   - 変更全体の分析: nav の gap を xs に変更
   - Type: chore (スタイル調整)
   - Subject: reduce navigation gap spacing
   - Body: 変更詳細説明
   - git add . && git commit (正常完了)

# 出力
Commit created: abc1234 chore: reduce navigation gap spacing
```

## 成功の基準 🎯

- ✅ 変更内容の確認完了
- ✅ 適切なコミットメッセージが作成された
- ✅ コミットが実行された
- ✅ 標準フッターが適切に付与された
