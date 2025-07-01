---
title: 'Branded Types を考える'
tags:
  [
    'typescript',
    'rust',
    'go',
    'type-system',
    'branded-types',
    'design-pattern',
    'type-safety',
  ]
description: 'Branded Types の実装コストと各言語でのアプローチを探り、型システムが設計意図を表現する言語として進化している現状を考察'
---

Branded Types という型安全性を高めるパターンがある。実際のユースケースでどの程度の実装量が必要なのか、各言語でどのようなアプローチが取られているのかを調査した。

## Branded Types の基本実装

TypeScript における Branded Types は驚くほどシンプルに実装できる。基本形はこうだ。

```typescript
type UserId = string & { __brand: 'UserId' };
type ProductId = string & { __brand: 'ProductId' };

// ブランド付けする関数
const UserId = (id: string): UserId => id as UserId;
const ProductId = (id: string): ProductId => id as ProductId;
```

これだけで UserId と ProductId の混同を防げる。実行時にはただの string だが、コンパイル時には別の型として扱われる。

## バリデーション済みデータの型表現

単なる ID の区別を超えて、Branded Types はバリデーション済みであることを型で表現できる。

```typescript
type Email = string & { __brand: 'Email' };

function createEmail(value: string): Email | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return null;
  return value as Email;
}

// 処理の段階を型で表現
type RawUserInput = string & { __brand: 'RawUserInput' };
type SanitizedInput = string & { __brand: 'SanitizedInput' };
type ValidatedInput = string & { __brand: 'ValidatedInput' };
```

こうすることで、未検証のデータがデータベースに保存されることを型レベルで防げる。

## バックエンド言語での実装

Rust では newtype パターンが一般的だ。

```rust
#[derive(Debug, Clone, PartialEq)]
struct UserId(String);

#[derive(Debug, Clone)]
struct Email(String);

impl Email {
    fn new(value: &str) -> Result<Self, &'static str> {
        if value.contains('@') {
            Ok(Email(value.to_string()))
        } else {
            Err("Invalid email format")
        }
    }
}
```

Go では defined type と struct のラップという 2 つの選択肢がある。

```go
// defined type - 型の区別はできるが、不正な値の作成は防げない
type UserId string
type ProductId string

// struct でラップ - より安全だがボイラープレートが増える
type Email struct {
    value string
}

func NewEmail(s string) (*Email, error) {
    if !strings.Contains(s, "@") {
        return nil, errors.New("invalid email")
    }
    return &Email{value: s}, nil
}
```

TypeScript の Branded Types が実行時に消えるのに対し、Rust や Go では実行時にも型情報が残る。その分、ボイラープレートは増える。

## 型システムの設計哲学

各言語の型に対するアプローチから、それぞれの設計哲学が見えてくる。

TypeScript は「型は開発時の道具」という立場で、実行時コストゼロの Branded Types を実現している。Rust は「型で所有権も表現」という思想のもと、newtype pattern でゼロコスト抽象化を達成。Go は「シンプルさ優先」で、完全性より実用性を重視している。

## 次世代言語への期待

型の表現力と書きやすさのバランスが、次世代言語の勝負どころになるだろう。理想的には、こんな構文があると良い。

```
// 架空の構文
validated type Email = string where |s| s.contains("@")
branded type UserId = uuid
```

実際、Gleam の opaque type や Roc のタグ付きユニオンなど、最近の言語はこの方向に進化している。

型システムは単なる「エラーを防ぐ仕組み」を超えて、「設計意図を表現する言語」になっている。Branded Types はその好例だ。実装コストと得られる型安全性のトレードオフを考慮しながら、プロジェクトに適したアプローチを選択することが重要だろう。
