# Codex Project Guide

This file is the Codex-specific project guide.

Codex should treat the documentation in `docs/` as the product contract and keep code, tests, and docs synchronized.

## Required Reading Order

1. `README.md` - project purpose and quick start.
2. `docs/ai-guide.md` - shared product and engineering workflow.
3. `docs/architecture.md` - system boundaries and dependencies.
4. `docs/api-contracts.md` - HTTP contracts and response shape.
5. `docs/coding-standards.md` - naming, layering, and implementation rules.
6. Relevant app README under `apps/*/README.md`.

## Working Rules

- Prefer small, focused changes over broad rewrites.
- Update docs when behavior, APIs, env vars, schemas, or commands change.
- Do not introduce new frameworks unless the task explicitly requires it.
- Do not hard-code secrets, tokens, passwords, or environment-specific URLs.
- Keep examples runnable or clearly marked as template examples.
- Use consistent response envelopes for APIs: `success`, `data`, `error`, `meta`.
- Keep Codex-specific behavior in this file or `.codex/` files.

## Verification

- For docs-only changes, check links, paths, and examples for consistency.
- For backend changes, run the narrowest available backend tests first.
- For frontend changes, run the narrowest available frontend tests first.
- If a validation command is unavailable, mention it in the final response.

## Demo Domain

The default demo domain is a Todo app with users and tasks. Use it to show authentication, authorization, CRUD, validation, pagination, error handling, and deployment conventions.
