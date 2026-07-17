# API Contracts

Base path: `/api/v1`

## Response Envelope

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: { requestId: string; pagination?: PaginationMeta };
};

type ApiFailure = {
  success: false;
  error: { code: string; message: string; details?: Record<string, unknown> };
  meta: { requestId: string };
};
```

## Create Todo

`POST /todos`

Request:

```json
{
  "title": "Write AI project docs",
  "description": "Document API and testing conventions"
}
```

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "todo_001",
    "title": "Write AI project docs",
    "description": "Document API and testing conventions",
    "completed": false,
    "createdAt": "2026-07-17T10:00:00.000Z",
    "updatedAt": "2026-07-17T10:00:00.000Z"
  },
  "meta": { "requestId": "req_001" }
}
```

## List Todos

`GET /todos?page=1&pageSize=20`

Response `200`:

```json
{
  "success": true,
  "data": [
    {
      "id": "todo_001",
      "title": "Write AI project docs",
      "description": "Document API and testing conventions",
      "completed": false,
      "createdAt": "2026-07-17T10:00:00.000Z",
      "updatedAt": "2026-07-17T10:00:00.000Z"
    }
  ],
  "meta": {
    "requestId": "req_002",
    "pagination": { "page": 1, "pageSize": 20, "total": 1 }
  }
}
```

## Update Todo

`PATCH /todos/{id}`

Request:

```json
{
  "title": "Write better AI project docs",
  "completed": true
}
```

Response `200`: same Todo object as create response.

## Delete Todo

`DELETE /todos/{id}`

Response `204`: empty body.
