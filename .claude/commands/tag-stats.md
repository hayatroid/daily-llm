# /tag-stats 📊

## 目的

タグの使用状況を分析し、有機的な進化を促すための統計レポートを生成する

## 使い方

`/tag-stats`

---

## なぜタグを統計するのか

このプロジェクトでは、タグを固定的な分類ではなく「生きた概念」として扱う。良いタグは自然に再利用され、使われないタグは自然に消えていく——まるで言語が進化するように。

統計を取ることで、どのタグが「生きている」か、どのタグが「眠っている」かが見える。これは単なる整理整頓ではない。プロジェクトの思考がどう進化しているかを可視化する試みだ。

## 実行内容 🔍

### Phase 1: データ収集 (Data Collection)

1. **全記事スキャン**:

   - `src/content/daily/**/*.md` から全記事を読み込み
   - 各記事の冒頭（frontmatter）にあるタグ情報を抽出
   - なぜここを見るか：このプロジェクトでは日付ごとに整理された記事の中にタグが記録されている

   ```yaml
   ---
   title: '記事タイトル'
   tags: ['life', 'philosophy', 'metacognition'] # ここがタグ
   ---
   ```

2. **統計情報の集計**:
   - 各タグの使用回数
   - 最後に使用された日付
   - 使用している記事のリスト
   - タグの初出日

### Phase 2: 分析と分類 (Analysis & Classification)

1. **タグの状態分類**:

   - **活性タグ**: 過去3ヶ月以内に使用
   - **休眠タグ**: 3-6ヶ月未使用
   - **廃止候補**: 6ヶ月以上未使用
   - **特別タグ**: `gem`（記事の品質を示す特別なマーカー。ユーザーが「この思考の軌跡は特に価値がある」と判断した記事のみに付与）

   なぜ3ヶ月と6ヶ月か？季節の変化のように、思考にも周期がある。3ヶ月は一つの季節、6ヶ月は半年——人間の思考パターンが変化するのに十分な期間だ。

2. **使用パターン分析**:
   - 頻出タグ（5回以上使用）
   - 単発タグ（1回のみ使用）
   - 共起パターン（よく一緒に使われるタグ）

### Phase 3: レポート生成 (Report Generation)

以下の形式でマークダウンレポートを生成：

```markdown
# Tag Statistics Report - YYYY-MM

## Summary

- Total unique tags: XX
- Active tags: XX
- Dormant tags: XX
- Candidates for removal: XX

## Active Tags (過去3ヶ月)

### Frequently Used (5+ times)

- develop: 15 articles
- life: 12 articles
- constraint-design: 5 articles

### Regular Use (2-4 times)

- philosophy: 3 articles
- type-safety: 2 articles

### Recent Additions (1 time, within 1 month)

- no-context: 1 article (2025-07-05)

## Dormant Tags (3-6ヶ月未使用)

- css-architecture (last used: 2025-04-01)
- wolfram (last used: 2025-03-15)

## Removal Candidates (6ヶ月以上未使用)

- online-judge (last used: 2024-12-30)
- symbolic-computation (last used: 2024-12-30)

## Special Tags

- gem: quality marker (2 articles) - protected

## Co-occurrence Patterns

- Often paired:
  - type-system & type-safety (3 times)
  - philosophy & metacognition (2 times)

## Evolution Suggestions

- Consider merging: dialogue & dialog-driven
- Trending up: constraint-design (increasing usage)
- Trending down: competitive-programming (decreasing usage)
```

### Phase 4: 保存と提案 (Save & Suggest)

1. **レポート保存**:

   - `.claude/tag-stats/YYYY-MM.md` として保存（ディレクトリがなければ作成）
   - 前月との比較情報も含める（2回目以降）
   - なぜ保存するか：タグの進化の歴史自体が、プロジェクトの思考の変遷を物語る貴重な記録となる

2. **アクション提案**:
   - 統合候補のタグペア（似た概念が別の言葉で表現されている場合）
   - 廃止を検討すべきタグ（もはや使われない概念は、思考が先に進んだ証）
   - 新しく定着しつつあるタグ（新たな「思考の結晶」の誕生）

## 活用方法 💡

### 月次レビュー

毎月初めに実行し、タグの健全性をチェック：

- 使われなくなったタグの整理
- 類似タグの統合
- 新しい「思考の結晶」の発見

### 記事作成時の参考

- どのタグが活発に使われているか確認
- 死んだタグを避ける
- 新しい概念には新タグを積極的に作成

### 年次振り返り

- タグの進化の歴史を追跡
- プロジェクトの思考の変遷を可視化
- 中核概念の定着を確認

## 実行例 🌟

```bash
/tag-stats

# 出力
Tag statistics report generated:
- 71 unique tags found
- 45 active, 18 dormant, 8 removal candidates
- Report saved to: .claude/tag-stats/2025-07.md

Key findings:
- "constraint-design" is gaining traction (5 uses in last month)
- "dialogue" and "dialog-driven" could be merged
- "online-judge" hasn't been used in 6+ months

Would you like to review the full report?
```

## 注意事項 ⚠️

- `gem`タグは統計には含めるが、削除提案からは除外（品質マーカーとして永続的に保護）
- タグの削除は提案のみ、実際の削除は手動で判断（機械的な削除は思考の痕跡を消してしまう）
- 新しいタグの「育成期間」として3ヶ月は様子を見る（新しい概念が定着するには時間が必要）

## このコマンドの本質

タグ統計は単なる管理ツールではない。それは、このプロジェクトがどのように考え、どのように進化してきたかを映し出す鏡だ。

使われなくなったタグは失敗ではなく、思考が先に進んだ証。新しいタグの誕生は、新たな概念の発見。そして長く使われ続けるタグは、プロジェクトの核となる思想を表している。

効率的な分類のためではなく、思考の軌跡を辿るために、このコマンドは存在する。
