# タグ進化システム設計書

## 背景と理念

このプロジェクトでは、タグを単なる分類ラベルではなく「思考の結晶」として扱う。良いタグは自然に再利用され、使われないタグは自然に消えていく有機的なシステムを目指す。

## システム概要

### 1. タグ統計の自動収集

月次でタグの使用状況を自動的に集計し、以下の情報を収集する：

- 各タグの使用回数
- 最後に使用された日付
- 使用されている記事のリスト
- タグの初出日

### 2. タグのライフサイクル

```
新規作成 → 活性期 → 休眠期 → 廃止候補 → アーカイブ
           ↑                              ↓
           └──────── 復活 ←───────────────┘
```

**状態定義：**

- **活性期**: 過去3ヶ月以内に使用
- **休眠期**: 3-6ヶ月未使用
- **廃止候補**: 6ヶ月以上未使用
- **保護タグ**: `gem`タグ自体は特別扱い（記事の質を示すマーカーとして）
- **gem タグの運用**: `gem`タグの付与・削除はユーザー（記事の著者）のみが行う。AIアシスタントは提案や付与を行わない。

### 3. 実装計画

#### Phase 1: 統計収集機能（MVP）

```typescript
// src/scripts/tag-stats.ts
interface TagUsage {
  tag: string;
  count: number;
  lastUsed: string; // YYYY-MM-DD
  articles: Array<{
    path: string;
    title: string;
    date: string;
  }>;
}

// 月次レポートの生成
function generateMonthlyReport(): TagReport {
  // 全記事をスキャン
  // タグ使用状況を集計
  // マークダウンレポートを生成
}
```

**コマンド化：**

```bash
npm run tag-stats
```

**出力例：**

```markdown
# Tag Statistics Report - 2025-07

## Active Tags (27)

- develop: 15 articles
- life: 12 articles
- constraint-design: 5 articles
  ...

## Dormant Tags (3)

- css-architecture (last used: 2025-04-01)
  ...

## Special Tags (1)

- gem: quality marker (always preserved)
```

#### Phase 2: 自動提案機能

統合候補の自動検出：

- 類似タグの検出（編集距離、意味的類似性）
- 共起パターンの分析
- 統合提案の生成

#### Phase 3: タグ進化の可視化

```markdown
# docs/tag-evolution-log.md

## 2025-07

### 新規追加

- `constraint-as-freedom`: 制約による自由の概念

### 統合

- `dialog-driven` + `dialogue` → `dialogue`

### 廃止

- `online-judge`: 6ヶ月以上未使用
```

### 4. 運用フロー

1. **月次レビュー**

   - 毎月1日に `npm run tag-stats` を実行
   - レポートを確認し、統合・廃止を検討
   - `tag-evolution-log.md` を更新

2. **新規記事作成時**

   - 既存タグの再利用を優先
   - 新しい概念には積極的に新タグを作成
   - 「思考の結晶」となる命名を心がける

3. **年次大掃除**
   - 年に1回、タグ体系全体を見直し
   - 使われなくなった概念をアーカイブ
   - 新しく定着した概念を中核タグに昇格

### 5. 技術的詳細

**ディレクトリ構造：**

```
docs/
  tag-evolution-system.md (本文書)
  tag-evolution-log.md    (進化の記録)
  tag-stats/
    2025-07.md
    2025-08.md
    ...
```

**スクリプト配置：**

```
src/
  scripts/
    tag-stats.ts         (統計収集)
    tag-analyzer.ts      (分析・提案)
    tag-report.ts        (レポート生成)
```

### 6. 今後の拡張可能性

- タグの相関関係の可視化（ネットワークグラフ）
- 読者のタグクリック分析（どのタグが興味を引くか）
- タグの「思考の結晶度」スコアリング
- 自動タグ提案AI（記事内容から適切なタグを提案）

## まとめ

このシステムにより、タグは固定的な分類体系ではなく、プロジェクトの思考とともに進化する生きた概念となる。効率的な管理ではなく、有機的な成長を目指す。
