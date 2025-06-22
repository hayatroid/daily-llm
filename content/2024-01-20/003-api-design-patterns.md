---
date: '2024-01-20'
time: '16:45'
title: 'RESTful API 設計のベストプラクティス'
tags: ['api', 'rest', '設計', 'backend']
---

# RESTful API 設計のベストプラクティス

## API 設計の基本原則

新しいプロジェクトで RESTful API を設計する際に考慮すべき重要なポイントについて議論しました。

### 1. リソース指向の設計

```javascript
// 良い例: リソースベースのURL設計
GET / api / users; // ユーザー一覧取得
GET / api / users / 123; // 特定ユーザー取得
POST / api / users; // ユーザー作成
PUT / api / users / 123; // ユーザー更新
DELETE / api / users / 123; // ユーザー削除

// 悪い例: 動詞ベースのURL
GET / api / getUsers;
POST / api / createUser;
POST / api / updateUser;
```

### 2. HTTP ステータスコードの適切な使用

```javascript
// Express.js での実装例
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません',
        code: 'USER_NOT_FOUND',
      });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({
      error: 'サーバーエラーが発生しました',
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
});
```

## エラーハンドリングの統一

### 一貫したエラーレスポンス形式

```javascript
// エラーレスポンスの標準形式
{
  "error": {
    "message": "バリデーションエラーが発生しました",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      },
      {
        "field": "password",
        "message": "パスワードは8文字以上である必要があります"
      }
    ]
  },
  "timestamp": "2024-01-20T16:45:00Z",
  "path": "/api/users"
}
```

### カスタムエラークラス

```javascript
class APIError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

class ValidationError extends APIError {
  constructor(details) {
    super('バリデーションエラーが発生しました', 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

// 使用例
const validateUser = (userData) => {
  const errors = [];

  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push({
      field: 'email',
      message: '有効なメールアドレスを入力してください',
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
};
```

## ページネーションの実装

```javascript
// カーソルベースページネーション
app.get('/api/users', async (req, res) => {
  const { cursor, limit = 20 } = req.query;

  const query = cursor ? { _id: { $gt: cursor } } : {};
  const users = await User.find(query)
    .limit(parseInt(limit) + 1)
    .sort({ _id: 1 });

  const hasMore = users.length > limit;
  const data = hasMore ? users.slice(0, -1) : users;

  res.json({
    data,
    pagination: {
      hasMore,
      nextCursor: hasMore ? data[data.length - 1]._id : null,
    },
  });
});
```

## API 認証とセキュリティ

### JWT 認証の実装

```javascript
const jwt = require('jsonwebtoken');

// JWT トークン生成
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// 認証ミドルウェア
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'アクセストークンが必要です',
      code: 'UNAUTHORIZED',
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: '無効なトークンです',
        code: 'FORBIDDEN',
      });
    }

    req.user = user;
    next();
  });
};
```

### レート制限の実装

```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: {
    error: 'リクエスト制限に達しました。しばらく待ってから再試行してください。',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);
```

## API ドキュメント化

### OpenAPI (Swagger) スキーマ

```yaml
openapi: 3.0.0
info:
  title: User Management API
  version: 1.0.0
  description: ユーザー管理システムのAPI

paths:
  /api/users:
    get:
      summary: ユーザー一覧取得
      parameters:
        - name: cursor
          in: query
          schema:
            type: string
          description: ページネーション用カーソル
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        '200':
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
```

## テスト戦略

```javascript
// Jest + Supertest でのテスト例
describe('GET /api/users', () => {
  test('ユーザー一覧を正常に取得できる', async () => {
    const response = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.pagination).toBeDefined();
  });

  test('認証なしでアクセスすると401エラー', async () => {
    const response = await request(app).get('/api/users').expect(401);

    expect(response.body.error).toBe('アクセストークンが必要です');
  });
});
```

## パフォーマンス最適化

### データベースクエリ最適化

```javascript
// N+1問題の解決
app.get('/api/users', async (req, res) => {
  // 悪い例: N+1 問題
  const users = await User.find();
  for (let user of users) {
    user.posts = await Post.find({ userId: user._id });
  }

  // 良い例: Populate 使用
  const users = await User.find().populate('posts');

  res.json({ data: users });
});
```

## 学んだこと

1. **一貫性の重要性**: URL設計、エラーハンドリング、レスポンス形式の統一
2. **セキュリティファースト**: 認証、認可、レート制限の実装
3. **ドキュメント化**: OpenAPIスキーマによる自動ドキュメント生成
4. **テスト駆動**: APIの動作保証とリグレッション防止

## 次の実装予定

- [ ] GraphQL API の検討
- [ ] リアルタイム通信（WebSocket）の追加
- [ ] API versioning 戦略の策定
