---
title: 'Docker Container Best Practices'
tags: ['docker', 'containers', 'devops', 'deployment']
outcome: 'セキュリティと最適化ベストプラクティス策定'
---

## User

I'm getting started with Docker and want to make sure I'm following best practices from the beginning. What are the most important things to keep in mind when creating Dockerfiles?

## Assistant

Great question! Here are the essential Docker best practices:

### 1. Use Specific Base Images

```dockerfile
# Bad: Latest tag is unpredictable
FROM node:latest

# Good: Pin to specific versions
FROM node:18.19-alpine

# Even better: Use digest for immutability
FROM node:18.19-alpine@sha256:a6b8...
```

### 2. Minimize Layer Count and Size

```dockerfile
# Bad: Multiple RUN commands create layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y git
RUN rm -rf /var/lib/apt/lists/*

# Good: Combine related commands
RUN apt-get update && \
    apt-get install -y curl git && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Use Multi-stage Builds

```dockerfile
# Build stage
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### 4. Optimize Layer Caching

```dockerfile
# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source code last (changes frequently)
COPY . .
```

## User

That makes sense! What about security considerations? I've heard Docker containers can have security vulnerabilities.

## Assistant

Absolutely! Container security is crucial. Here are key security practices:

### 1. Run as Non-Root User

```dockerfile
# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Switch to non-root user
USER nextjs

# Or use numeric IDs (better for Kubernetes)
USER 1001:1001
```

### 2. Use .dockerignore

```dockerignore
# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.secrets/
*.log
```

### 3. Scan for Vulnerabilities

```bash
# Use Docker's built-in scanning
docker scan myapp:latest

# Or use other tools
docker run --rm -v $(pwd):/app clair-scanner

# Snyk integration
snyk container test myapp:latest
```

### 4. Minimal Base Images

```dockerfile
# Use distroless or minimal images
FROM gcr.io/distroless/nodejs18-debian11

# Or Alpine for smaller attack surface
FROM node:18-alpine

# Avoid full OS images when possible
# FROM ubuntu:20.04  # Larger attack surface
```

### 5. Handle Secrets Properly

```dockerfile
# Bad: Secrets in ENV vars or COPY
ENV API_KEY=secret123
COPY secrets.txt /app/

# Good: Use build secrets (BuildKit)
# syntax=docker/dockerfile:1
FROM alpine
RUN --mount=type=secret,id=api_key \
    API_KEY=$(cat /run/secrets/api_key) && \
    # Use API_KEY here
```

### 6. Set Resource Limits

```dockerfile
# Use HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# In docker-compose or Kubernetes, set limits:
# memory: 512Mi
# cpu: 500m
```

Remember: **Security is layered** - container security + network security + runtime security!
