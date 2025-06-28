---
title: 'RESTful API Design Principles'
tags: ['api', 'rest', 'backend', 'design']
description: 'RESTful API 設計の基本原則を学習。適切な HTTP メソッドの使用、JSON ペイロードの構造化、エラーハンドリングの一貫性について理解。'
---

## User

I'm designing a REST API for the first time and want to make sure I follow good conventions. What are the key principles I should follow?

## Assistant

Excellent! Here are the fundamental RESTful API design principles:

### 1. Use Proper HTTP Methods

```bash
# CRUD operations mapping
GET    /users          # Retrieve all users
GET    /users/123      # Retrieve specific user
POST   /users          # Create new user
PUT    /users/123      # Update entire user
PATCH  /users/123      # Partial update
DELETE /users/123      # Delete user
```

### 2. Use Nouns, Not Verbs in URLs

```bash
# Bad: Verbs in URLs
POST /getUsers
POST /createUser
POST /updateUser/123

# Good: Nouns with HTTP methods
GET    /users
POST   /users
PUT    /users/123
```

### 3. Use Consistent Naming Conventions

```bash
# Use plural nouns for collections
GET /users
GET /orders
GET /products

# Use kebab-case for multi-word resources
GET /user-profiles
GET /order-items

# Nested resources for relationships
GET /users/123/orders
GET /orders/456/items
```

### 4. Return Appropriate HTTP Status Codes

```javascript
// Success codes
200 OK           // Successful GET, PUT, PATCH
201 Created      // Successful POST
204 No Content   // Successful DELETE

// Client error codes
400 Bad Request  // Invalid request data
401 Unauthorized // Authentication required
403 Forbidden    // Access denied
404 Not Found    // Resource doesn't exist
409 Conflict     // Resource already exists

// Server error codes
500 Internal Server Error
```

## User

That's really helpful! What about request and response formats? How should I structure the JSON payloads?

## Assistant

Great question! Consistent JSON structure is crucial for API usability:

### 1. Request Body Structure

```json
// POST /users - Create user
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}

// PATCH /users/123 - Partial update
{
  "email": "newemail@example.com"
}

// Use camelCase for field names consistently
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890"
}
```

### 2. Response Structure

```json
// Single resource
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-18T15:20:00Z",
  "updatedAt": "2024-01-18T15:20:00Z"
}

// Collection with metadata
{
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

### 3. Error Response Format

```json
// Standardized error format
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "age",
        "message": "Age must be between 18 and 120"
      }
    ]
  }
}
```

### 4. Filtering, Sorting, and Pagination

```bash
# Filtering
GET /users?status=active&role=admin

# Sorting
GET /users?sort=name&order=asc
GET /users?sort=-createdAt  # Descending with minus prefix

# Pagination
GET /users?page=2&limit=20
GET /users?offset=40&limit=20

# Combined
GET /users?status=active&sort=name&page=1&limit=10
```

### 5. Versioning Strategy

```bash
# URL versioning (most common)
GET /v1/users
GET /v2/users

# Header versioning
GET /users
Accept: application/vnd.api+json;version=1

# Query parameter versioning
GET /users?version=1
```

### 6. Content Negotiation

```bash
# Request JSON
Accept: application/json

# Request XML
Accept: application/xml

# Specify response format
Content-Type: application/json
```

Key principle: **Be consistent across your entire API**. Pick conventions and stick to them!
