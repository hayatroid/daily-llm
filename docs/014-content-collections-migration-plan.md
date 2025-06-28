# 🚀 Content Collections Migration Plan

## 🎯 Goals

- **全消し再構築** - VirtualFS を完全削除し、Content Collections ベースで再実装
- **汎用的ファイルシステム** - プロジェクト固有概念に依存しない抽象化
- **責務の明確化** - 各コンポーネントが単一責任を持つ
- **型安全性の向上** - Zod スキーマによる自動型推論
- **Astro ベストプラクティス** - 公式推奨パターンの採用

## 🚫 Non-Goals

- 既存コードの漸進的改良
- VirtualFS との互換性維持
- プロジェクト固有の概念（conversation, summary など）への依存
- 複雑なファイルシステム抽象化

## 🔍 **現在の実装の根本的問題点**

### **VirtualFS の技術的負債**

- **手作りファイルシステム** - Astro Content Collections があるのに独自実装
- **`any` だらけの型定義** - 型安全性が皆無
- **重複ロジック** - 各コンポーネントで `Astro.glob()` を重複実行
- **テスト不可能** - 複雑な内部状態でユニットテストできない

### **UNIX 哲学の偽装**

- **見た目だけ UNIX** - 実際は巨大なモノリシック VirtualFS クラス
- **`path` prop の嘘** - 実際は Astro.glob() 結果に依存
- **複雑なパス変換** - `content/2024-01-15/` → `/2024-01-15/` の手動変換

### **Astro アンチパターン**

- **Content Collections を無視** - Astro の標準機能を使わない
- **ビルド時最適化なし** - 毎回ファイルシステム構築
- **型推論の恩恵なし** - Zod スキーマによる自動型生成を使わない

## 🏗️ **汎用的ファイルシステム構造の抽出**

### **本質的構造 (プロジェクト非依存)**

```
📁 階層化コンテンツシステム
├── グループ化 (2024-01-15, 2024-01-18)
├── インデックスファイル (index.md) - ディレクトリ要約
├── 通常ファイル (001-*.md, 002-*.md) - 個別コンテンツ
└── URL マッピング
    ├── グループページ: /2024-01-15/
    └── コンテンツページ: /2024-01-15/001-astro-setup
```

### **汎用的メタデータ設計**

```typescript
// src/content/config.ts
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    isIndex: z.boolean().default(false), // index.md かどうか
    // 他のフィールドは動的に追加可能（time など）
  }),
});
```

### **構造的情報の抽出 (slug ベース)**

```typescript
// slug から構造的情報を派生
function extractStructure(slug: string) {
  const parts = slug.split('/');
  const group = parts[0]; // "2024-01-15"
  const filename = parts[1]; // "001-astro-setup" or "index"
  const isIndex = filename === 'index';

  return { group, filename, isIndex };
}
```

## 📋 **新しいコンポーネント契約設計**

### **責務の明確化**

#### **Prompt** - 純粋表示コンポーネント

```typescript
interface PromptProps {
  command: string;
  clickable?: boolean;
  href?: string;
}
// 責務: コマンド文字列をターミナル風に表示
// データ依存: なし（純粋なUI）
```

#### **Pwd** - パス表示コンポーネント

```typescript
interface PwdProps {
  path: string; // "/2024-01-15/001-astro-setup"
}
// 責務: path文字列からbreadcrumbを生成
// データ依存: なし（純粋な文字列処理）
```

#### **Cat** - 単一コンテンツ表示コンポーネント

```typescript
interface CatProps {
  path: string; // "/2024-01-15/001-astro-setup"
}
// 責務: path → slug 変換してエントリを直接取得・表示
// データ依存: getEntry('posts', pathToSlug(path))
```

#### **Tree** - コンテンツ一覧表示コンポーネント

```typescript
interface TreeProps {
  path: string; // "/2024-01-15/" or "/"
}
// 責務: path をフィルター条件に変換してエントリ一覧を表示
// データ依存: getCollection('posts').filter(pathToFilter(path))
```

## 🔄 **データフロー設計**

### **現在 (複雑で脆い)**

```
Page → Astro.glob() → VirtualFS → path文字列操作 → Component
```

### **新設計 (シンプルで堅牢)**

```
Page → path → Component → getEntry/getCollection (Content Collections直接使用)
```

### **具体的なマッピング**

```typescript
// /2024-01-15/ (グループページ)
<Pwd path="/2024-01-15/" />
<Tree path="/2024-01-15/" />
<Cat path="/2024-01-15/index" />  // インデックス表示

// /2024-01-15/001-astro-setup (コンテンツページ)
<Pwd path="/2024-01-15/001-astro-setup" />
<Cat path="/2024-01-15/001-astro-setup" />

// / (ホームページ)
<Pwd path="/" />
<Tree path="/" />  // 全体のツリー表示
```

## 📁 **ファイル構造移行**

### **移行前 (content/)**

```
content/
├── 2024-01-15/
│   ├── 001-astro-setup.md
│   ├── 002-terminal-styling.md
│   └── index.md
└── 2024-01-18/
    ├── 001-docker-containers.md
    └── index.md
```

### **移行後 (src/content/)**

```
src/content/
├── 2024-01-15/
│   ├── 001-astro-setup.md
│   ├── 002-terminal-styling.md
│   └── index.md
└── 2024-01-18/
    ├── 001-docker-containers.md
    └── index.md
```

## 📋 **実装チェックリスト**

### **Phase 1: Content Collections セットアップ**

- [x] `src/content/config.ts` 作成
- [x] 汎用的スキーマ定義
- [x] ディレクトリ移動 (`content/` → `src/content/`)
- [x] 最初の数ファイルで動作確認

### **Phase 2: コンポーネント直接実装**

- [x] **Cat.astro** - `path` → `slug` 変換して `getEntry()` 直接使用
- [x] **Tree.astro** - `path` → filter条件変換して `getCollection()` 直接使用
- [x] **Pwd.astro** - そのまま（データ非依存）
- [x] **Prompt.astro** - そのまま（純粋UI）

### **Phase 3: 統合テスト**

- [x] 全ページの動作確認
- [x] URL構造の維持確認
- [x] 型安全性の確認

### **Phase 4: クリーンアップ**

- [x] `src/lib/filesystem.ts` 完全削除
- [x] VirtualFS 関連の型定義削除
- [x] `Astro.glob()` 呼び出し削除
- [x] 不要な util 関数削除

## 🎉 **期待される改善効果**

### **コード品質**

- **大幅なコード量削減** - VirtualFS 中間レイヤー完全削除
- **完全な型安全性** - Zod スキーマによる自動型推論
- **直接的なデータアクセス** - Content Collections を直接使用

### **開発体験**

- **Astro ベストプラクティス** - 公式推奨パターンの採用
- **IntelliSense 向上** - 型推論による補完強化
- **エラーメッセージ改善** - Zod バリデーションエラー

### **パフォーマンス**

- **ビルド時最適化** - Content Collections のネイティブ最適化を活用
- **重複データロード削除** - `Astro.glob()` の重複実行を排除
- **バンドルサイズ大幅削減** - VirtualFS 中間レイヤー完全削除

## 🚀 **成功指標**

- [x] **VirtualFS 完全削除** - filesystem.ts とすべての依存関係が削除される
- [x] **URL 互換性** - 既存 URL がすべて動作する
- [x] **型安全性** - TypeScript エラーが発生しない
- [x] **直接的データアクセス** - Content Collections のみでデータ取得
- [x] **ビルド成功** - エラーなくビルドが完了する

## ✅ **実装完了レビュー**

**2024-06-28 実装完了** - 計画通りすべての項目が実装され、VirtualFS という技術的負債を完全に排除。Content Collections ネイティブな実装により本質的改善を達成:

### **アーキテクチャの本質的改善**

- **統一されたインターフェース** - 全コンポーネントが `path: string` で一貫
- **責務の明確化** - データ取得をコンポーネント内に集約、ページは path 渡しのみ
- **Astro 標準への準拠** - Content Collections による型安全な実装
- **複雑性の排除** - VirtualFS 中間レイヤーと重複コードを完全削除

### **設計目標の完全達成**

- **Tree.astro** - path から自動的にビュー判別、単一コンポーネントで全階層表示
- **Cat.astro** - path から slug への透明な変換、getEntry() による直接アクセス
- **データフロー簡素化** - Page → path → Component → Content Collections
- **保守性向上** - 型安全性とフレームワーク標準機能の活用

**「構造の本質だけ抽出して Content Collections の世界観で再実装」完全達成！** 🎉
