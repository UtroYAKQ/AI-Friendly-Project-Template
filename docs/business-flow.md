# Business Flow

## Demo Domain

The demo domain is a personal Todo app. Each authenticated user owns their own Todo items.

## Actors

- Visitor: unauthenticated person using the app.
- User: authenticated account owner.
- System: frontend, backend, and persistence services.

## Flow: Create Todo

1. User enters a title and optional description.
2. Frontend disables submit while the request is in flight.
3. Backend validates the title is present and no longer than 120 characters.
4. Backend creates a Todo owned by the current user.
5. Frontend inserts the new Todo into the list.

### Acceptance Criteria

- Empty title returns `VALIDATION_ERROR`.
- Unauthenticated request returns `UNAUTHORIZED`.
- Created Todo starts with `completed = false`.

## Flow: Complete Todo

1. User clicks the complete checkbox.
2. Frontend calls `PATCH /api/v1/todos/{id}` with `completed: true`.
3. Backend verifies the Todo belongs to the current user.
4. Backend updates `completed_at` when completed becomes true.
5. Frontend updates the item without reloading the page.

### Acceptance Criteria

- Missing Todo returns `TODO_NOT_FOUND`.
- Todo owned by another user returns `FORBIDDEN`.
- Repeating the same completion state is idempotent.

## Flow: List Todos

1. User opens the Todo page.
2. Frontend calls `GET /api/v1/todos?page=1&pageSize=20`.
3. Backend returns only Todos owned by the current user.
4. Frontend renders empty, loading, success, and error states.

### Acceptance Criteria

- List response includes pagination metadata.
- Default sort is newest first.
- Deleted Todos are excluded from normal lists.
