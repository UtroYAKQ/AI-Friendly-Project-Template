# Architecture

## Goal

This demo shows how to document a small full-stack Todo system so AI agents can safely extend it.

## System Overview

```text
Browser UI
  -> Frontend app in apps/demo-frontend
  -> Backend API in apps/demo-backend
  -> Database or repository layer
```

## Backend Modules

- `server.ts`: creates the HTTP server and registers routes.
- `todos/todo-routes.ts`: HTTP boundary for Todo endpoints.
- `todos/todo-service.ts`: Todo business rules and validation.
- `todos/todo-repository.ts`: persistence abstraction.
- `shared/response.ts`: API response envelope helpers.
- `shared/http-error.ts`: typed errors for API failures.

## Frontend Modules

- `App.tsx`: page-level data loading and state orchestration.
- `components/TodoForm.tsx`: create Todo form.
- `components/TodoList.tsx`: list and completion actions.
- `api/todo-api.ts`: backend HTTP client.

## Dependency Rules

- Frontend components must not know backend implementation details.
- Backend routes must not access the database directly.
- Services must not import HTTP request/response objects.
- Shared helpers must not depend on feature modules.

## Data Flow

1. User submits a Todo title in the frontend.
2. Frontend API client sends `POST /api/v1/todos`.
3. Backend route validates transport input.
4. Service enforces title length and ownership rules.
5. Repository stores the Todo.
6. Route returns the standard response envelope.
