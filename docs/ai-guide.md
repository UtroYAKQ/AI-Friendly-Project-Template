# AI Guide

This file contains shared product and engineering workflow for AI-assisted development. Tool-specific behavior belongs in `AGENTS.md` for Codex or `.claude/CLAUDE.md` for Claude Code.

## Before Coding

1. Read your tool-specific entrypoint: Codex reads `AGENTS.md`; Claude Code reads `.claude/CLAUDE.md`.
2. Read this file.
3. Read the docs related to the task: architecture, API contracts, schema, testing, security, deployment.
4. Identify which files are source of truth for the requested behavior.
5. Make a small plan before editing multiple files.

## Source Of Truth

- Business behavior: `docs/business-flow.md`
- HTTP contracts: `docs/api-contracts.md`
- Database design: `docs/database-schema.md`
- Error codes: `docs/error-codes.md`
- Security boundaries: `docs/security.md`
- Test strategy: `docs/testing.md`
- Runtime/deployment: `docs/deployment.md`

## Implementation Checklist

- Keep changes inside the correct app or docs area.
- Add or update tests when behavior changes.
- Update API docs when request/response shapes change.
- Update database docs when fields, indexes, or constraints change.
- Update deployment docs when env vars, ports, or services change.
- Prefer explicit validation and clear error codes.

## Good AI Prompt Example

```text
Implement Todo completion.
Read docs/api-contracts.md and docs/database-schema.md first.
Keep the response envelope unchanged.
Add tests for success, unauthorized access, and missing todo.
Update docs/error-codes.md if a new error code is needed.
```

## Bad AI Prompt Example

```text
Make todos work.
```

This is too vague because it does not define contracts, validation, ownership, or acceptance criteria.
