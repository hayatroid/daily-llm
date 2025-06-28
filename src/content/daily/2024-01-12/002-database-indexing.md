---
title: 'Database Indexing Best Practices'
tags: ['database', 'sql', 'performance', 'indexing']
description: 'データベースクエリのパフォーマンス改善のため、インデックスの効果的な使い方とそのトレードオフを学習。クエリ最適化の実践的アプローチを理解。'
---

## User

My database queries are getting slower as the data grows. I've heard about indexing but I'm not sure when and how to use it effectively. Can you explain?

## Assistant

Database indexing is crucial for performance! Here's a practical guide:

### What are Indexes?

Indexes are data structures that improve query speed by creating shortcuts to your data. Think of them like a book's index - instead of reading every page to find a topic, you can jump directly to the right page.

### When to Create Indexes

```sql
-- 1. Primary keys (usually auto-indexed)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(100)
);

-- 2. Frequently queried columns
CREATE INDEX idx_users_email ON users(email);

-- 3. Foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- 4. Columns used in WHERE clauses
CREATE INDEX idx_orders_status ON orders(status);
```

### Composite Indexes

For queries with multiple conditions:

```sql
-- If you often query: WHERE user_id = ? AND status = ?
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Order matters! Put more selective columns first
CREATE INDEX idx_orders_date_status ON orders(created_at, status);
```

### Index Types

```sql
-- B-tree (default, good for equality and range queries)
CREATE INDEX idx_users_created_at ON users(created_at);

-- Hash (only for equality comparisons)
CREATE INDEX idx_users_email_hash ON users USING HASH(email);

-- Partial indexes (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

## User

This is really helpful! Are there any downsides to creating too many indexes? And how do I know which queries need optimization?

## Assistant

Excellent questions! Yes, indexes have trade-offs:

### Downsides of Too Many Indexes

1. **Storage Overhead**: Each index takes disk space
2. **Write Performance**: INSERTs/UPDATEs/DELETEs become slower
3. **Maintenance Cost**: Database has to keep indexes updated

```sql
-- Example: This table might be over-indexed
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  price DECIMAL(10,2),
  category_id INT,
  brand_id INT,
  created_at TIMESTAMP
);

-- Too many indexes:
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_created ON products(created_at);
CREATE INDEX idx_products_name_category ON products(name, category_id);
-- This is probably excessive!
```

### How to Identify Queries Needing Optimization

**1. Use EXPLAIN/EXPLAIN ANALYZE:**

```sql
EXPLAIN ANALYZE SELECT * FROM orders
WHERE user_id = 123 AND status = 'pending';

-- Look for:
-- - Seq Scan (bad for large tables)
-- - High cost numbers
-- - Long execution times
```

**2. Monitor Slow Query Logs:**

```sql
-- PostgreSQL: Enable slow query logging
SET log_min_duration_statement = 1000; -- Log queries > 1 second

-- MySQL: Enable slow query log
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 1;
```

**3. Use Database Monitoring Tools:**

- PostgreSQL: `pg_stat_statements`
- MySQL: Performance Schema
- Tools like pgAdmin, MySQL Workbench

### Best Practices

1. **Start with queries, then add indexes** - don't guess!
2. **Monitor index usage** - remove unused indexes
3. **Consider composite indexes** for multi-column queries
4. **Be careful with small tables** - indexes might not help

The goal is finding the sweet spot between read and write performance!
