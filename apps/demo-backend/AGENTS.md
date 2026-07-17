# Demo Backend Codex Guide

These Codex rules apply to `apps/demo-backend/`.

## Scope

- Keep backend code organized by route, service, repository, and shared helpers.
- Keep HTTP response shapes aligned with `docs/api-contracts.md`.
- Keep error codes aligned with `docs/error-codes.md`.
- Keep migration files in `apps/demo-backend/migrations/` aligned with `docs/database-schema.md`.

## Rules

- Do not put business rules directly in route handlers.
- Validate request input before calling service methods.
- Do not expose stack traces or sensitive values in API responses.
- Add a matching `.down.sql` rollback file for every forward migration.
