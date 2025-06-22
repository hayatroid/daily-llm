---
title: 'React 最適化とパフォーマンス改善'
tags: ['react', 'performance', 'optimization']
outcome: 'レンダリング65%高速化、メモリ38%削減'
---

## 問題の特定

現在の React アプリケーションでレンダリング速度の問題が発生しています。特に、ユーザーリストの表示で顕著なパフォーマンス低下が見られます。

```jsx
// 問題のあるコンポーネント
const UserList = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

## 最適化アプローチ

### 1. React.memo の活用

不要な再レンダリングを防ぐため、`React.memo` を使用してコンポーネントをメモ化します。

```jsx
const UserCard = React.memo(({ user }) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});
```

### 2. useMemo による計算結果のキャッシュ

重い計算処理は `useMemo` でキャッシュすることで、毎回の計算を避けられます。

```jsx
const ExpensiveUserList = ({ users, filter }) => {
  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  return (
    <div>
      {filteredUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};
```

### 3. 仮想化による大量データの処理

大量のデータを扱う場合は、仮想化ライブラリを使用します。

```jsx
import { FixedSizeList as List } from 'react-window';

const VirtualizedUserList = ({ users }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <UserCard user={users[index]} />
    </div>
  );

  return (
    <List height={600} itemCount={users.length} itemSize={100}>
      {Row}
    </List>
  );
};
```

## 結果

これらの最適化により、以下の改善が得られました：

- **初期レンダリング時間**: 2.3秒 → 0.8秒 (65%改善)
- **再レンダリング時間**: 800ms → 200ms (75%改善)
- **メモリ使用量**: 45MB → 28MB (38%削減)

## 学んだこと

1. **プロファイリングの重要性**: React DevTools の Profiler で実際のボトルネックを特定することが大切
2. **過度な最適化は避ける**: 必要な部分にのみ最適化を適用する
3. **ユーザー体験の向上**: パフォーマンス改善は直接的に UX の向上につながる

## 次のステップ

- [ ] コードスプリッティングの実装
- [ ] Service Worker によるキャッシュ戦略
- [ ] Web Vitals の継続的な監視
