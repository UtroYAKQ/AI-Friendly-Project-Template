# Demo Frontend Codex Guide

These Codex rules apply to `apps/demo-frontend/`.

## Scope

- Keep frontend code organized by page, component, and API client.
- Keep API calls aligned with `docs/api-contracts.md`.
- Keep UI states explicit: loading, empty, success, and error.

## Rules

- Do not call `fetch` directly from presentational components.
- Keep components small and prop-driven.
- Do not hard-code production API URLs in source files.
