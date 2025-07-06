---
title: 'もう verify されてないコードは書きたくない'
tags:
  [
    'develop',
    'testing',
    'competitive-programming',
    'verification',
    'differential-testing',
  ]
description: 'continue と break の取り違えで競技時間を溶かした経験から、コードの検証手法を体系的に探求する'
---

ユーザは Dijkstra 法の実装で continue と break を取り違え、コンテストの時間を丸々失った。その痛みから「もう verify されてないものはこりごりだ」という切実な思いが生まれた。

## ランタイムエラーの恐怖

競技プログラミングでの continue/break の取り違えは、コンパイルエラーにはならない。実行して初めて、最短経路が正しく計算されないことに気づく。Web 開発でも同様の「微妙な違いによる致命的バグ」は存在する。

```javascript
// useEffect の依存配列忘れ
useEffect(() => {
  setData(fetchData());
}); // [] を忘れただけで無限レンダリング

// await 忘れ
const data = fetchData(); // Promise が返る
console.log(data.result); // undefined でクラッシュ
```

コンパイル時に防げるものは良い。TypeScript や ESLint が守ってくれる。しかしランタイムエラーは、特定の条件・タイミング・環境でしか発生しないことも多く、デバッグが困難だ。

## 競プロ由来の検証手法

競技プログラミングでは「ナイーブな実装との比較」がよく使われる。計算量は O(V^2) でも確実に正しい実装を用意し、高速版と結果を比較する。

```javascript
// 愚直だが確実な Dijkstra
function dijkstraNaive(graph, start) {
  const n = graph.length;
  const dist = Array(n).fill(Infinity);
  const used = Array(n).fill(false);
  dist[start] = 0;

  for (let i = 0; i < n; i++) {
    let v = -1;
    for (let u = 0; u < n; u++) {
      if (!used[u] && (v === -1 || dist[u] < dist[v])) v = u;
    }
    used[v] = true;
    for (let u = 0; u < n; u++) {
      dist[u] = Math.min(dist[u], dist[v] + graph[v][u]);
    }
  }
  return dist;
}
```

この手法の学術的背景は Differential Testing (McKeeman, 1998) にある。「遅いけど正しい実装」を Oracle として使うことで、最適化版の正しさを保証する。

## Property-based Testing の威力

fast-check は、ランダムテストケースを大量に生成して検証する。人間が思いつかないエッジケースを自動的に発見してくれる。

```javascript
// グラフのランダム生成と検証
const graphArbitrary = fc.nat({ max: 20 }).chain((n) =>
  fc.record({
    nodes: fc.constant(n),
    edges: fc.array(
      fc.tuple(
        fc.nat({ max: n - 1 }),
        fc.nat({ max: n - 1 }),
        fc.nat({ min: 1, max: 100 })
      ),
      { minLength: n - 1, maxLength: (n * (n - 1)) / 2 }
    ),
  })
);

fc.assert(
  fc.property(graphArbitrary, (graphData) => {
    const graph = buildGraph(graphData);
    const naive = dijkstraNaive(graph, 0);
    const fast = dijkstraFast(graph, 0);
    return deepEqual(naive, fast);
  })
);
```

Web 開発での fast-check 活用例も豊富だ。フォームバリデーション、日付処理、API の冪等性など、様々な場面で威力を発揮する。

```javascript
// 日付フォーマットの可逆性をテスト
fc.assert(
  fc.property(fc.date(), (date) => {
    const formatted = formatDate(date);
    const parsed = parseDate(formatted);
    // format → parse で元に戻る
    return parsed.getTime() === date.getTime();
  })
);

// ページネーションの不変条件
fc.assert(
  fc.property(
    fc.record({
      totalItems: fc.nat({ max: 1000 }),
      itemsPerPage: fc.nat({ min: 1, max: 50 }),
      currentPage: fc.nat({ min: 1 }),
    }),
    ({ totalItems, itemsPerPage, currentPage }) => {
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const validPage = Math.min(currentPage, Math.max(1, totalPages));

      const result = paginate(totalItems, itemsPerPage, validPage);
      // 現在ページは必ず範囲内
      return result.currentPage >= 1 && result.currentPage <= totalPages;
    }
  )
);

// 文字列正規化の冪等性
fc.assert(
  fc.property(fc.string(), (str) => {
    const normalized = normalizeString(str);
    const twiceNormalized = normalizeString(normalized);
    // 2回正規化しても結果は同じ
    return normalized === twiceNormalized;
  })
);
```

## 検証の体系化へ

ユーザの「もう verify されてないコードは書きたくない」という言葉には、単なる技術的な話を超えた切実さがある。時間を失い、信頼を失い、自信を失う。そんな経験はもうしたくない。

Property-based testing は、ランダムな入力で「性質」を検証する。Differential testing は、複数の実装を比較して正しさを保証する。これらの手法を組み合わせることで、コードの正しさを多層的に保証できる。

検証されたコードを書くことは、未来の自分への贈り物だ。continue と break を取り違えて失った時間は戻らないが、その経験は確実に次への糧となる。
