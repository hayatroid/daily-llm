---
title: 'Branded Types がいいらしい'
tags:
  [
    'typescript',
    'branded-types',
    'type-safety',
    'rust',
    'go',
    'fsharp',
    'scala',
    'programming-languages',
  ]
description: 'Branded types の実用性から各言語の実装哲学まで。実行時コストゼロの型安全性、言語別の ergonomics 比較、そして次世代言語への理想を語る。'
---

Branded types は型レベルプログラミングの素晴らしい例で、**実行時コストゼロで堅牢性を大幅に向上**させられる技術だ。

## Branded Types の威力

```typescript
// 危険: 値の混同が起きやすい
function transferMoney(from: string, to: string, amount: number) {
  // from と to を間違えるバグが頻発...
}

// 安全: 型レベルで区別
type UserId = string & { readonly _brand: 'UserId' };
type AccountId = string & { readonly _brand: 'AccountId' };
type Amount = number & { readonly _brand: 'Amount' };

function transferMoney(from: UserId, to: AccountId, amount: Amount) {
  // 型エラーで間違いを防げる！
}
```

**実際の価値**:

- 🛡️ **実行時コストゼロ**: JavaScript にコンパイルされると普通の string/number
- 🎯 **意図の明確化**: コードが自己文書化される
- 🚫 **バグの根絶**: 値の混同によるバグを型レベルで防止

## 活用場面

大規模データでの ID 混同防止はもちろん、他にも様々な場面で威力を発揮する。

### 単位系の管理

```typescript
type Seconds = number & { readonly _brand: 'Seconds' }
type Milliseconds = number & { readonly _brand: 'Milliseconds' }

function delay(ms: Milliseconds) { ... }
function timeout(seconds: Seconds) { ... }

// setTimeout が secs を取るのか millis を取るのか一目瞭然
delay(5000 as Milliseconds) // 意図が明確
```

### バリデーション済みデータ

```typescript
type ValidEmail = string & { readonly _brand: 'ValidEmail' }
type SanitizedHTML = string & { readonly _brand: 'SanitizedHTML' }

function sendEmail(to: ValidEmail) { ... }
function renderHTML(content: SanitizedHTML) { ... }

// バリデーション関数で「格上げ」
function validateEmail(input: string): ValidEmail | null {
  return isValidEmail(input) ? input as ValidEmail : null
}
```

### 状態管理

```typescript
type DraftPost = Post & { readonly _brand: 'Draft' };
type PublishedPost = Post & { readonly _brand: 'Published' };

function publish(draft: DraftPost): PublishedPost {
  // ドラフトのみ公開可能、不正な状態遷移を型レベルで防止
  return { ...draft, publishedAt: new Date() } as PublishedPost;
}
```

## コンパイルタイムで弾く哲学

**コンパイルタイムで弾けるものは弾く**、これが型レベルプログラミングの本質だ。ランタイムエラーは致命的：

- **本番環境でのクラッシュ** 💥
- **データ破損** 🗃️💀
- **セキュリティホール** 🔓
- **デバッグの困難さ** 🐛❓

型レベルで防げるなら、開発者体験も向上し、リファクタリングも安全になる。

## 言語別実装哲学の違い

各言語で branded types の実装方法と哲学が大きく異なる。

**TypeScript**: **「漸進的移行」哲学**

```typescript
type UserId = string & { _brand: 'UserId' };
```

- JavaScript との互換性最優先
- 開発時だけの恩恵、ランタイムは素の JavaScript

**Rust**: **「ゼロコスト安全性」哲学**

```rust
struct UserId(String); // type UserId = String はただのエイリアス
```

- パフォーマンスを犠牲にしない安全性
- 厳格だが `user_id.0` でのアクセスが億劫

**Go**: **「実用主義」哲学**

```go
type UserId string
```

- シンプルイズベスト
- underlying type のメソッドが使える絶妙なバランス

**F#**: **「関数型エレガンス」哲学**

```fsharp
type UserId = UserId of string
```

- パターンマッチで自然に扱える `let processUser (UserId id) = ...`
- 簡潔な構文で型推論も強力

**Scala**: **「表現力重視」哲学**

```scala
opaque type UserId = String
```

- 複数の実装方法を提供
- 強力だが複雑になりがち

## 次世代言語への展望

これからの時代、**コンパイルタイムでエラーを防ぐガードレール**が重要になる：

- コードの複雑化 → より多くのガードレールが必要
- チーム開発の増加 → 暗黙知の型レベル表現が重要
- AI コード生成の普及 → 型制約で AI の間違いも防げる

次世代言語は **branded types が書きやすい** 設計になるはずだ：

- **Zig** → `const UserId = distinct []u8`
- **Nim** → `type UserId = distinct string`
- **Carbon** → 型安全性を重視した設計

## 理想の branded types

**薄いラップ**が理想的だ。Rust の `.0` アクセスは億劫：

```rust
user_id.0 // なんか冗長...
```

理想は：

```
// 作成時は明示的
let userId = UserId("user-123")

// 使用時は透明に
println!("{}", userId) // .0 不要
let length = userId.length() // String のメソッドがそのまま
processUser(userId) // 型チェックは効く
processProduct(userId) // ❌ でもこれはエラー
```

**次世代言語の理想**：

- 型安全性は Rust レベル
- エルゴノミクスは Go レベル
- パターンマッチは F# レベル

**「透明だけど安全」**、これが次世代 branded types の目指すべき姿だ。型レベルプログラミングが「特殊技術」から「当たり前の作法」になる時代が来る。
