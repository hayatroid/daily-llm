---
title: 'CQRS + ES を理解したい'
date: 2025-07-06
tags:
  [
    cqrs,
    event-sourcing,
    ddd,
    architecture,
    bookkeeping,
    async,
    consistency,
    reality-modeling,
  ]
description: '現実世界のモデリングとCRUD的発想のギャップから始まり、簿記という身近な例を通してCQRS+ESの本質を発見する思考の軌跡'
---

ユーザは「CQRS + ES のキャッチアップをしたい」という率直な要求から対話を始めた。CQRS（Command Query Responsibility Segregation）と ES（Event Sourcing）、これらのアーキテクチャパターンについて理解を深めたいという。

## 現実とモデルのギャップ

最初の問いかけは、普段のアプリケーション開発における違和感についてだった。データベースに対して「保存」と「読み込み」を同じモデルで扱う CRUD（Create, Read, Update, Delete）アプローチ。EC サイトの注文履歴を例に、「記録したいこと」と「見せたいこと」のギャップを指摘してみた。

ユーザの反応が興味深かった。現実のモデルをそのままプログラミングに落とし込みたいが、実際はテーブルの CRUD に終始してしまう、と。

ここに重要な洞察があった。現実世界は「出来事の連続」として成り立っているのに、データベースでは「現在の状態のスナップショット」として扱ってしまう。引っ越しや銀行口座の残高を例に出すと、この違和感がより明確になった。

## 簿記という発見

ユーザが持ち出した例が秀逸だった。「簿記なんて特に」という一言。

そう、簿記こそまさに Event Sourcing の原型だ。仕訳帳には日々の取引が時系列で記録される。そして月末や年度末に、これらの仕訳を集計して貸借対照表（B/S）や損益計算書（P/L）という「現在の状態」を作り出す。仕訳帳がまさに Event Store で、B/S や P/L が Read Model に相当する。数百年前から、会計の世界では「出来事の記録」と「現在の状態の表示」の分離が当たり前だった。

ただしユーザは現実的な視点も持っていた。CRUD が向くサービスと CQRS+ES が向くサービスがある、と。確かに、都道府県マスタに Event Sourcing は過剰だろう。

## 後から気づくEvent Sourcing

SNS の投稿編集履歴や Git を例に挙げたユーザの発言で、面白い現象に気づいた。多くのシステムが「後から Event Sourcing っぽくなる」のだ。最初は CRUD で始めたのに、「履歴も見たい」「変更理由も記録したい」という要求が増えていく。

## CQRSとESの必然的な結合

「そもそも CQRS+ES すらよくわかってない」という正直な告白から、基礎に立ち返った。

簿記の例で説明すると：

- CQRS = 仕訳を記録する行為（Command）と、B/S・P/L を参照する行為（Query）を分ける考え方
- Event Sourcing = 仕訳帳のように、起きた出来事を時系列で記録し続ける方式

なぜこの 2 つがセットで語られるのか？それぞれ単独で使った場合の問題を考えると見えてくる。Event Sourcing をやると、必然的に「イベントの記録」と「現在の状態の表示」という 2 つの責務が生まれる。これはまさに CQRS が解決しようとしている問題構造そのものだ。

## 実体を掴む

モデルは掴めたが実体が掴めていない、というユーザの感覚は重要だった。概念から実装へ移行する段階だ。

従来の CRUD なら`UPDATE orders SET status = 'confirmed'`で終わり。でも Event Sourcing では`OrderCreated`、`ItemAdded`、`CouponApplied`、`OrderConfirmed`という一連のイベントとして記録される。

「じゃあ、現在の注文状態を画面に表示したい時はどうするの？」

まさにそこで CQRS の出番。イベントを「再生」して読み込み専用のビューを作る。

## いつ、どうやって更新するか

「そう！それ。」という反応が示すように、これが実装の核心だった。

同期的更新と非同期更新、それぞれのトレードオフを説明すると、「結果整合性」という概念が登場した。

最初は問題に見えるかもしれない。でも現実世界を考えてみると、銀行振込もレストランの注文も、実は非同期だ。銀行振込は送金処理から相手口座への反映まで時間がかかる。レストランでは注文を受けてから料理が提供されるまでにタイムラグがある。むしろ全てが瞬時に同期する方が非現実的。この「現実世界の非同期性」を素直に受け入れることで、システムはよりスケーラブルで障害に強くなる。

## 非同期でも整合性を保つ

非同期更新でかつ整合性を保つ技術について知りたい、というリクエストに応えて、Event Sourcing の真の力を説明した。

イベントストアが単一の真実の源（Single Source of Truth）になることで、以下が可能になる：

1. **イベントの順序保証**：Version による順序管理
2. **Projection**：どこまで処理したかを記録し、失敗時は再実行
3. **楽観的UI更新**：ユーザー体験の向上
4. **Saga/Process Manager**：複数の処理にまたがる整合性

これらの仕組みを説明すると、「良いですね」という反応が返ってきた。システムが現実世界により近づいていることを感じ取ったようだ。

## ユーザーへ送る記事：参考リンク集

対話の最後に「勉強用に信頼できるソースが欲しい」というリクエストがあった。以下、実践に役立つリソースをまとめておく。

### 基礎を固める

- [Martin Fowler - CQRS](https://web.archive.org/web/20231231134143/https://martinfowler.com/bliki/CQRS.html)
- [Martin Fowler - Event Sourcing](https://web.archive.org/web/20231226034431/https://martinfowler.com/eaaDev/EventSourcing.html)
- [EventStore Documentation](https://www.kurrent.io/)

### 実装パターンを学ぶ

- Eric Evans "Domain-Driven Design" - DDD の原典
- Vaughn Vernon "Implementing Domain-Driven Design" - 実装例が豊富

### 実践的なリソース

- [Microsoft CQRS Journey](<https://learn.microsoft.com/en-us/previous-versions/msp-n-p/jj554200(v=pandp.10)>)
- Greg Young's Talks on YouTube - Event Store 作者の講演

### 日本語リソース

- 増田亨さんのブログ・講演資料
- 成瀬允宣 "ドメイン駆動設計入門"

### 実装を始めるなら

- [EventStore](https://www.kurrent.io/) - Event Sourcing 用データベース
- [Axon Framework](https://www.axoniq.io/) - Java/Kotlin 向け CQRS/ES フレームワーク

これらのリソースを読む際は、「なぜこのアプローチが生まれたか」という問題意識を理解することが大切だ。Greg Young がよく言うように、"Event sourcing is not a new concept, it's been used by accountants for centuries" — 会計士は何世紀も前から同じことをやっているのだから。
