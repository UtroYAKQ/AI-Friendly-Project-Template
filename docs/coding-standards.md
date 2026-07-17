# Coding Standards

## General

- Keep files focused on one responsibility.
- Prefer descriptive names over abbreviations.
- Do not mix transport logic, business logic, and persistence logic in one function.
- Use environment variables for runtime configuration.
- Keep demo code simple enough for new contributors and AI agents to understand.

## Backend Layering

```text
route/controller -> service -> repository -> database/external system
```

- Routes parse HTTP input and map HTTP output.
- Services enforce business rules.
- Repositories handle persistence.
- Shared utilities handle response envelopes, errors, logging, and configuration.

## Frontend Layering

```text
page -> component -> api client -> backend
```

- Pages coordinate data loading and state.
- Components render UI and emit user intents.
- API clients own HTTP details and response parsing.

## Naming

- Files: kebab-case, for example `todo-service.ts`.
- Types/classes: PascalCase, for example `TodoService`.
- Functions/variables: camelCase, for example `createTodo`.
- Constants: UPPER_SNAKE_CASE, for example `DEFAULT_PAGE_SIZE`.
- Database tables: snake_case plural, for example `todos`.

## Errors

- Throw typed/domain errors in services.
- Map errors to HTTP status codes at the route boundary.
- Use stable error codes from `docs/error-codes.md`.
- Never expose internal stack traces to API consumers.

## Logging

- Log request id, user id, operation, and failure reason.
- Do not log passwords, access tokens, refresh tokens, or personal secrets.
- Prefer structured logs over free-form strings in production code.
