# Testing

## Test Pyramid

- Unit tests: validation, services, pure helpers.
- Integration tests: API route + service + repository behavior.
- E2E tests: one or two critical user flows through the UI.

## Backend Test Examples

Recommended cases for Todo APIs:

- Create Todo succeeds with valid title.
- Create Todo rejects empty title with `VALIDATION_ERROR`.
- List Todos returns only current user's items.
- Update Todo rejects missing id with `TODO_NOT_FOUND`.
- Delete Todo is idempotent only if product requirements allow it.

Example command:

```bash
npm run test --workspace apps/demo-backend
```

## Frontend Test Examples

Recommended cases for Todo UI:

- Renders loading state before data arrives.
- Renders empty state when no Todos exist.
- Submits a new Todo and clears the form.
- Displays API errors without losing existing Todos.

Example command:

```bash
npm run test --workspace apps/demo-frontend
```

## AI Verification Rule

AI agents must not say tests passed unless they actually ran the command and saw success output.
