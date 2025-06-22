---
date: '2024-01-20'
time: '14:15'
title: 'Docker multi-stage build によるイメージ最適化'
tags: ['docker', 'devops', 'インフラ']
---

# Docker multi-stage build によるイメージ最適化

## 背景

現在の Docker イメージサイズが 1.2GB と大きく、デプロイ時間とストレージコストが問題となっています。multi-stage build を活用してイメージサイズの削減を図ります。

## 現在のDockerfile（改善前）

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**問題点:**

- 開発用依存関係も含まれている
- ビルドツールが本番環境に残っている
- 不要なファイルがコピーされている

## 改善後のDockerfile

```dockerfile
# ステージ1: ビルド環境
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --silent
COPY . .
RUN npm run build

# ステージ2: 本番環境
FROM node:18-alpine AS production
WORKDIR /app

# 本番用パッケージのみインストール
COPY package*.json ./
RUN npm ci --only=production --silent && npm cache clean --force

# ビルド成果物のみコピー
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## さらなる最適化

### .dockerignoreの活用

```dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.env.local
coverage
.nyc_output
```

### 軽量ベースイメージの選択

```dockerfile
# 通常の node イメージ: 993MB
FROM node:18

# alpine ベース: 174MB
FROM node:18-alpine

# distroless イメージ: 最小限
FROM gcr.io/distroless/nodejs18-debian11
```

## 結果

| 項目           | 改善前  | 改善後  | 削減率 |
| -------------- | ------- | ------- | ------ |
| イメージサイズ | 1.2GB   | 180MB   | 85%    |
| ビルド時間     | 8分30秒 | 3分45秒 | 56%    |
| プル時間       | 2分15秒 | 25秒    | 81%    |

## Docker Compose での活用

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      target: production
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## セキュリティ考慮事項

1. **非rootユーザーでの実行**

   ```dockerfile
   RUN addgroup -g 1001 -S nodejs
   RUN adduser -S nextjs -u 1001
   USER nextjs
   ```

2. **脆弱性スキャン**

   ```bash
   # Trivyを使用した脆弱性スキャン
   docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
     aquasec/trivy image myapp:latest
   ```

3. **最小権限の原則**
   - 必要なファイルのみをコピー
   - 不要なパッケージのインストールを避ける

## CI/CD パイプラインでの統合

```yaml
# GitHub Actions 例
- name: Build Docker image
  run: |
    docker build --target production -t myapp:${{ github.sha }} .
    docker tag myapp:${{ github.sha }} myapp:latest

- name: Security scan
  run: |
    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
      aquasec/trivy image myapp:${{ github.sha }}
```

## 学んだこと

1. **multi-stage build の威力**: 85% のサイズ削減を実現
2. **セキュリティファースト**: 最小権限でイメージを構築
3. **継続的な最適化**: 定期的なイメージサイズとセキュリティの監視が重要

## 次のアクション

- [ ] Kubernetes 環境での動作確認
- [ ] イメージレイヤーキャッシュの最適化
- [ ] 自動脆弱性スキャンの導入
