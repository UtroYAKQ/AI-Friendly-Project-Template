# API Rules

Use these rules for every HTTP API in this project.

## Response Envelope

Successful response:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "requestId": "req_123"
  }
}
```

Failed response:

```json
{
  "success": false,
  "error": {
    "code": "TODO_NOT_FOUND",
    "message": "Todo does not exist",
    "details": {}
  },
  "meta": {
    "requestId": "req_123"
  }
}
```

## Contract Rules

- Use nouns for resources: `/api/v1/todos`, not `/api/v1/getTodos`.
- Use HTTP status codes consistently: `200`, `201`, `400`, `401`, `403`, `404`, `409`, `422`, `500`.
- Validate all request bodies, path params, and query params before business logic.
- Return stable error codes from `docs/error-codes.md`.
- Include pagination metadata for list APIs.
- Never return password hashes, tokens, or internal stack traces.

## Todo API Example

```http
POST /api/v1/todos
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Write project docs",
  "description": "Add AI-readable API contracts"
}
```

```json
{
  "success": true,
  "data": {
    "id": "todo_001",
    "title": "Write project docs",
    "description": "Add AI-readable API contracts",
    "completed": false
  },
  "meta": {
    "requestId": "req_001"
  }
}
```
