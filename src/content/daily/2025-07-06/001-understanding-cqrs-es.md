---
title: 'CQRS + ES を理解したい'
date: 2025-07-06
tags:
  [
    'develop',
    'event-sourcing',
    'architecture',
    'bookkeeping',
    'async',
    'consistency',
    'reality-modeling',
  ]
description: '現実世界のモデリングと CRUD 的発想のギャップから始まり、簿記という身近な例を通して CQRS+ES の本質を発見する思考の軌跡'
---

ユーザは「CQRS + ES のキャッチアップをしたい」という率直な要求から対話を始めた。CQRS（Command Query Responsibility Segregation）と ES（Event Sourcing）、これらのアーキテクチャパターンについて理解を深めたいという。

## 現実とモデルのギャップ

最初の問いかけは、普段のアプリケーション開発における違和感についてだった。データベースに対して「保存」と「読み込み」を同じモデルで扱う CRUD（Create, Read, Update, Delete）アプローチ。EC サイトの注文履歴を例に、「記録したいこと」と「見せたいこと」のギャップを指摘してみた。

ユーザの反応が興味深かった。現実のモデルをそのままプログラミングに落とし込みたいが、実際はテーブルの CRUD に終始してしまう、と。

ここに重要な洞察があった。現実世界は「出来事の連続」として成り立っているのに、データベースでは「現在の状態のスナップショット」として扱ってしまう。引っ越しや銀行口座の残高を例に出すと、この違和感がより明確になった。

## 簿記という発見

ユーザが持ち出した例が興味深い。「簿記なんて特に」という一言。

簿記... 何か引っかかる。仕訳帳には日々の取引が時系列で記録される。売上があった、仕入れをした、給料を払った。すべて「いつ」「何が起きたか」の記録だ。

そして月末になると、これらの仕訳を集計して貸借対照表（B/S）や損益計算書（P/L）を作る。

ちょっと待てよ。

仕訳帳は「出来事の記録」で、B/S や P/L は「現在の状態」...

これはまさに、私たちが議論していた構造と同じではないか。仕訳帳が Event Store で、B/S や P/L が Read Model に相当する。数百年前から、会計の世界では「出来事の記録」と「現在の状態の表示」の分離が当たり前だった。

ただしユーザは現実的な視点も持っていた。CRUD が向くサービスと CQRS + ES が向くサービスがある、と。確かに、都道府県マスタに Event Sourcing は過剰だろう。

## 後から気づく Event Sourcing

SNS の投稿編集履歴や Git を例に挙げたユーザの発言で、面白い現象に気づいた。多くのシステムが「後から Event Sourcing っぽくなる」のだ。最初は CRUD で始めたのに、「履歴も見たい」「変更理由も記録したい」という要求が増えていく。

## CQRS と ES の必然的な結合

「そもそも CQRS + ES すらよくわかってない」という正直な告白から、基礎に立ち返った。

簿記の例で説明すると：

- CQRS = 仕訳を記録する行為（Command）と、B/S・P/L を参照する行為（Query）を分ける考え方
- Event Sourcing = 仕訳帳のように、起きた出来事を時系列で記録し続ける方式

なぜこの 2 つがセットで語られるのか？それぞれ単独で使った場合の問題を考えると見えてくる。Event Sourcing をやると、必然的に「イベントの記録」と「現在の状態の表示」という 2 つの責務が生まれる。これはまさに CQRS が解決しようとしている問題構造そのものだ。

## 実体を掴む

モデルは掴めたが実体が掴めていない、というユーザの感覚は重要だった。概念から実装へ移行する段階だ。

従来の CRUD なら注文確定はこうなる：

```sql
UPDATE orders
SET status = 'confirmed',
    confirmed_at = NOW()
WHERE id = ?
```

シンプルだ。でも、何が失われている？「なぜ確定したのか」「いつクーポンが適用されたのか」「どの順番で商品が追加されたのか」

Event Sourcing ではこうなる：

```javascript
// 注文作成から確定までの一連の出来事
const events = [
  { type: 'OrderCreated', customerId: 'C123', timestamp: '10:00:00' },
  { type: 'ItemAdded', productId: 'P456', quantity: 2, timestamp: '10:00:15' },
  { type: 'ItemAdded', productId: 'P789', quantity: 1, timestamp: '10:01:30' },
  {
    type: 'CouponApplied',
    code: 'SAVE10',
    discount: 0.1,
    timestamp: '10:02:00',
  },
  { type: 'OrderConfirmed', paymentId: 'PAY789', timestamp: '10:03:00' },
];
```

すべての「出来事」が記録される。順番も、タイミングも、理由も。

「じゃあ、現在の注文状態を画面に表示したい時はどうするの？」

まさにそこで CQRS の出番。イベントを「再生」して読み込み専用のビューを作る。

## いつ、どうやって更新するか

「そう！それ。」という反応が示すように、これが実装の核心だった。

同期的更新と非同期更新、それぞれのトレードオフを説明すると、「結果整合性」という概念が登場した。

最初は問題に見えるかもしれない。でも現実世界を考えてみると、銀行振込もレストランの注文も、実は非同期だ。銀行振込は送金処理から相手口座への反映まで時間がかかる。レストランでは注文を受けてから料理が提供されるまでにタイムラグがある。むしろ全てが瞬時に同期する方が非現実的。この「現実世界の非同期性」を素直に受け入れることで、システムはよりスケーラブルで障害に強くなる。

## 非同期でも整合性を保つ

非同期更新でかつ整合性を保つ技術について知りたい、というリクエストに応えて、Event Sourcing の真の力を説明した。

まず基本的な問題から考えよう。1000 件のイベントがある注文の現在状態を知りたい。毎回 1000 件を再生する？それは現実的ではない。

ここで「Projection」という考え方が登場する。イベントを順番に処理して、現在の状態を別途保持しておく：

```javascript
// Projection の例
let orderProjection = {};

for (const event of events) {
  switch (event.type) {
    case 'OrderCreated':
      orderProjection = {
        customerId: event.customerId,
        items: [],
        status: 'created',
      };
      break;
    case 'ItemAdded':
      orderProjection.items.push({
        productId: event.productId,
        quantity: event.quantity,
      });
      break;
    case 'OrderConfirmed':
      orderProjection.status = 'confirmed';
      break;
  }
  // どこまで処理したかを記録
  orderProjection.lastProcessedVersion = event.version;
}
```

さらに複雑な問題もある。注文確定時に在庫を減らし、支払いを処理し、配送を手配する。これらすべてが成功しないと注文を確定できない。しかも、それぞれ別のサービスかもしれない。

ここで「Saga」パターンの出番だ。複数の処理を調整し、失敗時には補償処理を行う：

```javascript
// Saga の例（概念的）
class OrderSaga {
  async handle(OrderConfirmed) {
    try {
      await inventoryService.reserve(items);
      await paymentService.charge(amount);
      await shippingService.schedule(order);
      await eventStore.append('OrderCompleted');
    } catch (error) {
      // 補償処理
      await inventoryService.cancelReservation(items);
      await paymentService.refund(amount);
      await eventStore.append('OrderFailed', { reason: error });
    }
  }
}
```

イベントストアが単一の真実の源（Single Source of Truth）になることで、これらの複雑な処理も一貫性を保ちながら実現できる。

これらの仕組みを説明すると、「良いですね」という反応が返ってきた。

## しかし、すべてが薔薇色ではない

ここまでの説明で Event Sourcing は魅力的に見えるかもしれない。だが、現実はそう単純ではない。

### 実装の複雑性

従来の CRUD なら数行で済む処理が、Event Sourcing では何倍ものコードになる。イベントの定義、ハンドラー、Projection、Saga... 開発者の認知的負荷は確実に増える。

### 運用の課題

- **イベントスキーマの進化**: 一度記録したイベントは変更できない。新しい要件に対応するには？
- **デバッグの困難さ**: 現在の状態は過去のすべてのイベントの結果。問題の原因を特定するのは容易ではない
- **ストレージコスト**: すべての出来事を永続化する。データ量は増え続ける一方だ

### いつ採用すべきか？

Event Sourcing が真価を発揮するのは：

- 監査ログが法的要件（金融、医療、政府系）
- 「なぜこうなったか」の説明責任が重要
- 時系列での分析やレポートが必要
- 複雑なビジネスプロセスの可視化

逆に避けるべき場合：

- シンプルな CRUD で十分な場合
- 開発チームに経験者がいない
- 短期間でのリリースが求められる
- 現在の状態だけが重要で履歴は不要

## 簿記に学ぶ

簿記のアナロジーに戻ろう。すべての商店が複式簿記を使うわけではない。小さな個人商店なら、現金出納帳だけで十分かもしれない。規模や要件に応じて適切な記録方法を選ぶ。

技術選択も同じだ。Event Sourcing は強力な道具だが、すべての問題に適用すべきではない。

## 問いかけ

CQRS と Event Sourcing は、現実世界の「出来事」と「状態」の関係をモデリングする一つの方法だ。簿記という数百年の歴史を持つ実践から学べることは多い。

しかし、あなたのシステムではどうだろうか？

記録すべき「出来事」は何か？それを記録する価値は本当にあるのか？複雑性を受け入れる覚悟はあるか？

技術選択に正解はない。大切なのは、トレードオフを理解した上で、意識的に選択することだ。
