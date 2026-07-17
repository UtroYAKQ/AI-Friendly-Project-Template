# Demo Backend

Minimal Todo API showing route, service, repository, response envelope, and typed error patterns.

## Structure

```text
migrations/
  0001_create_users_and_todos.sql
  0001_create_users_and_todos.down.sql
src/
  server.ts
  shared/
    http-error.ts
    response.ts
  todos/
    todo-model.ts
    todo-repository.ts
    todo-routes.ts
    todo-service.ts
```

## Commands

```bash
npm install
npm run dev
npm run test
```

## API

- `GET /api/v1/todos`
- `POST /api/v1/todos`
- `PATCH /api/v1/todos/:id`
- `DELETE /api/v1/todos/:id`

This demo uses an in-memory repository. Replace `todo-repository.ts` with database persistence in real projects, and keep `migrations/` aligned with `docs/database-schema.md`.

