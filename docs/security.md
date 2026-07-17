# Security

## Authentication

- Use `Authorization: Bearer <token>` for protected APIs.
- Reject missing, expired, malformed, or revoked tokens with `UNAUTHORIZED`.
- Do not store access tokens in logs, analytics, or error messages.

## Authorization

- Every Todo belongs to one user.
- Users can only list, read, update, or delete their own Todos.
- Ownership checks happen in the service layer, not only in the UI.

## Input Validation

- Validate request bodies, query params, and path params.
- Enforce title length: 1 to 120 characters.
- Trim user-provided strings before validation.
- Reject unknown enum values and invalid pagination values.

## Sensitive Data

- Never return `password_hash`, refresh tokens, API keys, or internal secrets.
- Use `.env.example` for configuration names, not real values.
- Rotate secrets if they are accidentally committed.

## Common Risks

- SQL injection: use parameterized queries or ORM bindings.
- XSS: escape user content in the frontend and avoid unsafe HTML rendering.
- CSRF: use same-site cookies or CSRF tokens if cookie auth is used.
- Rate limiting: protect login, registration, and write APIs.
