# 🌱 YARC — Yet Another REST Client

A semantic REST client that focuses on REST entities and endpoints. It provides a higher-level abstraction for your API calls.

## What's this about / Features

- Semantic code organization
- Promise-based (async/await) API
- Custom actions
- Nested endpoints
- Depends on the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## Install

```
npm install --save yarc-client
```

## Usage

```javascript
import yarc from 'yarc-client'

const api = yarc(
  { baseUrl: '/api/v1/' },
  {
    users: { books: { onMember: [{ POST: 'mark_read' }] }, notes: {} },
    books: { onCollection: [{ GET: lookup }] },
    notes: { onCollection: [{}] },
  },
)
```

### Basic CRUD

```javascript
// Get a single user (GET /api/v1/users/1)
await api.users(1).fetch()

// Update a user (PATCH /api/v1/users/1)
await api.users(1).update({ name: 'John' })

// Get all books (GET /api/v1/books?page=0&limit=20)
await api.books().fetch({ page: 0, limit: 20 })
```

### Nested endpoints

```javascript
// Get all notes by a user (GET /api/v1/users/1/notes)
await api
  .users(1)
  .notes()
  .fetch()
```

### Custom actions

```javascript
// Lookup a book (GET /api/v1/books/lookup?query=abc)
await api.books().lookup({ query: 'abc' })

// Mark a book as read (POST /api/v1/users/1/books/123/mark_read)
await api
  .users(1)
  .books(123)
  .mark_read()
```
