---
title: 'テスト駆動入試物理を考える'
tags:
  [
    'fsharp',
    'physics',
    'symbolic-math',
    'education',
    'online-judge',
    'units-of-measure',
    'test-driven',
  ]
description: 'F# の Units of Measure から着想を得て、次元チェック・極限検証・シンボリック計算を組み合わせた革新的な物理学習支援システムの設計を探求。'
---

F# の `Units of Measure` 機能を眺めていて、ふと「テスト駆動入試物理」という発想が浮かんだ。入試物理の定石である「まず次元、次に極限、最後に数値」というアプローチを、プログラムによる自動検証システムとして実現できないだろうか。

## F# Units of Measure の威力

F# では物理量を型レベルで区別できる：

```fsharp
[<Measure>] type m; [<Measure>] type s; [<Measure>] type kg

let distance = 100.0<m>
let time = 10.0<s>
let velocity = distance / time  // 型: float<m/s>

// 次元の自動導出
let acceleration = velocity / time  // float<m/s^2>
let force = 5.0<kg> * acceleration  // float<kg m/s^2> = Newton
```

実行時コストゼロで次元チェックが働く。これは単なる便利機能を超えて、**物理学習の本質的な手法をプログラムで表現**する可能性を示している。

## テスト駆動入試物理のコンセプト

入試物理の鉄則：

1. **次元解析**: まず式の次元が合っているか
2. **極限チェック**: 物理的に妥当な極限挙動か
3. **数値確認**: 特殊ケースで期待値が出るか

これをテスト駆動開発のアプローチで自動化する：

```fsharp
// 振り子の周期をテスト駆動で検証
let pendulumPeriod (length: float<m>) (gravity: float<m/s^2>) =
    2.0 * Math.PI * sqrt(length / gravity)  // 型: float<s>

[<Test>]
let ``次元チェック`` () =
    // コンパイル時に型安全性が保証される
    pendulumPeriod 1.0<m> 9.8<m/s^2> |> should be (ofType<float<s>>)

[<Test>]
let ``極限チェック: 重力無限大`` () =
    // g → ∞ で T → 0
    let strongGravity = 9.8e10<m/s^2>
    pendulumPeriod 1.0<m> strongGravity |> should be (lessThan 0.001<s>)

[<Test>]
let ``数値チェック: 地球標準`` () =
    // l=1m, g=9.8m/s² で T≈2.01s
    pendulumPeriod 1.0<m> 9.8<m/s^2> |> should (equalWithin 0.01<s>) 2.01<s>
```

## シンボリック計算による厳密解析

数値代入によるテストはオーバーフローやゼロ割りのリスクがある。**SymbolicMath.NET** を使えば、より数学的に厳密な検証が可能：

```fsharp
open MathNet.Symbolics

// 二体問題の換算質量で極限を解析的に計算
let m1 = symbol "m1"
let m2 = symbol "m2"
let reducedMass = (m1 * m2) / (m1 + m2)

// m2 → ∞ の極限をシンボリックに計算
let limit = Calculus.limit m2 PositiveInfinity reducedMass
// 結果: m1 （証明完了）
```

これにより、実数値の危険性を回避しつつ、数学的に厳密な極限解析ができる。

## 教育的オンラインジャッジの設計

従来のオンラインジャッジは「正解/不正解」の二分法だが、物理学習では **段階的フィードバック** が重要：

```fsharp
type DetailedJudgeResult = {
    Stage1_Symbols: SymbolCheckResult      // 未定義記号は使っていないか
    Stage2_Dimensions: DimensionResult     // 次元は合っているか
    Stage3_Form: FormCheckResult           // 式の構造は妥当か
    Stage4_Limits: LimitCheckResult        // 極限挙動は物理的に正しいか
    Stage5_Numerical: NumericalResult      // 特殊値で合っているか
    EducationalHints: string list          // 学習支援メッセージ
}
```

フィードバック例：

- ❌「不正解」→ ✅「次元が合いません: 期待値[T], あなたの式[L]」
- ❌「Wrong Answer」→ ✅「g→∞の極限で発散していますが、物理的には0に収束するはずです」
- ❌「Compilation Error」→ ✅「未定義記号 'h' を使用しています。許可された記号: [l, g, π, T]」

## 実装アーキテクチャ

```fsharp
type PhysicsJudge = {
    DimensionCheck: Expression -> DimensionResult
    SymbolicEquivalence: Expression -> Expression -> bool
    LimitAnalysis: Expression -> (Symbol * LimitPoint) list -> LimitResult
    NumericalValidation: Expression -> (Symbol * float) list -> bool
}

// 入試問題の定義
let swingProblem = {
    Description = "長さ l の振り子の周期 T を求めよ（小角近似を用いよ）"
    AllowedSymbols = ["l"; "g"; "π"; "T"]
    ExpectedDimension = "[T]"
    LimitChecks = [
        ("g → ∞", "T → 0")     // 重力が強いと早く振れる
        ("l → 0", "T → 0")     // 振り子が短いと早く振れる
    ]
    SpecialCases = [
        ("l = 1[m], g = 9.8[m/s²]", "T ≈ 2.01[s]")
    ]
}
```

## 技術スタックと将来展望

**現実的な技術組み合わせ**：

1. **F#** - 型安全な物理量定義
2. **SymbolicMath.NET** - 基本的なシンボリック計算
3. **Wolfram MCP** - 高度な解析（級数展開、複雑な極限）
4. **FsCheck** - Property-based testing による物理法則の検証

**将来への展望**：

- 他科目への応用（数学の証明チェック、化学の反応式バランス等）
- AI 生成コードの検証にも活用可能
- 「間違いから学ぶ」教育システムの実現

## まとめ

「テスト駆動入試物理」は単なる技術的な可能性を超えて、**物理学習の本質的な思考プロセスをプログラムで表現**する試みだ。次元解析、極限チェック、数値検証という物理学の基本的な検証手法を自動化することで、学習者により深い理解をもたらす教育的システムが構築できる。

F# の型システムと SymbolicMath.NET の組み合わせは、この構想を現実的に実装可能なレベルまで押し上げている。「正解か不正解か」ではなく「なぜ間違っているのか」を教えてくれるシステム—それが次世代の教育技術の姿かもしれない。
