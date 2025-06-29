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
description: 'Branded types の実用性から各言語の実装哲学まで。コンパイルタイムでの型安全性、言語別の ergonomics 比較、そして次世代言語への理想を語る。'
---

ユーザは Branded types について調べていた。型レベルプログラミングの例として、コンパイル時に型チェックして安全性を高められることに注目していた。

## Branded Types の使い方

ユーザは、ID の混同を防ぐ基本的な使い方から確認していた。

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

特に気に入っていたポイント:

- コンパイル時型チェック: JavaScript にコンパイルされると普通の string/number
- 意図の明確化: コードが自己文書化される
- バグの根絶: 値の混同によるバグを型レベルで防止

## いろいろな使い方

ユーザは、ID の混同防止以外にも、いろいろな場面で使えることを考えていた。

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

## コンパイル時にエラーを防ぐ考え方

ユーザは、「コンパイル時に防げるものは防ぐ」というのが型レベルプログラミングの基本だと言っていた。実行時エラーの問題を挙げていた：

- 本番環境でのクラッシュ
- データ破損
- セキュリティホール
- デバッグの困難さ

型レベルで防げるなら、開発者体験も向上し、リファクタリングも安全になると言っていた。

## 各言語でのやり方の違い

ユーザは、各言語で branded types の実装方法や考え方が異なることを比較していた。

TypeScript: 「漸進的移行」哲学

```typescript
type UserId = string & { _brand: 'UserId' };
```

- JavaScript との互換性最優先
- 開発時だけの恩恵、ランタイムは素の JavaScript

Rust: 「ゼロコスト安全性」哲学

```rust
struct UserId(String); // type UserId = String はただのエイリアス
```

- パフォーマンスを犠牲にしない安全性
- 厳格だが `user_id.0` でのアクセスが億劫

Go: 「実用主義」哲学

```go
type UserId string
```

- シンプルイズベスト
- underlying type のメソッドが使える絶妙なバランス

F#: 「関数型エレガンス」哲学

```fsharp
type UserId = UserId of string
```

- パターンマッチで自然に扱える `let processUser (UserId id) = ...`
- 簡潔な構文で型推論も強力

Scala: 「表現力重視」哲学

```scala
opaque type UserId = String
```

- 複数の実装方法を提供
- 強力だが複雑になりがち

## 今後の言語に期待すること

ユーザは、これからの言語ではコンパイル時のエラー防止がもっと重要になると考えていた：

- コードの複雑化 → より多くのガードレールが必要
- チーム開発の増加 → 暗黙知の型レベル表現が重要
- AI コード生成の普及 → 型制約で AI の間違いも防げる

次世代言語は branded types を書きやすくするだろうと言っていた：

- **Zig** → `const UserId = distinct []u8`
- **Nim** → `type UserId = distinct string`
- **Carbon** → 型安全性を重視した設計

## 理想の branded types

ユーザは、薄いラップが理想的だと言っていた。Rust の `.0` アクセスは面倒だと感じていた：

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

次世代言語の理想：

- 型安全性は Rust レベル
- エルゴノミクスは Go レベル
- パターンマッチは F# レベル

「透明だけど安全」が次世代 branded types の目指すべき姿だと言っていた。型レベルプログラミングが特殊な技術から当たり前のやり方になる時代が来るだろうと言っていた。
