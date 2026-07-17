# Claude Project Instructions

This file is the Claude Code-specific project guide.

Read this file before editing the repository with Claude Code.

## Context Files

- Start with this file for Claude Code behavior.
- Use `docs/ai-guide.md` for shared product and engineering workflow.
- Use `.claude/rules/api.md` when creating or changing HTTP APIs.
- Use `docs/coding-standards.md` for naming, layering, validation, logging, and errors.

## Behavior

- Explain assumptions before implementing ambiguous requirements.
- Keep code changes aligned with the documented architecture.
- Update API docs, error codes, and tests together when API behavior changes.
- Prefer readable examples over clever abstractions in demo code.
- Keep Claude Code-specific behavior in this file or `.claude/rules/` files.

## Output Expectations

- Mention modified files in the final response.
- Mention validation commands that were run or skipped.
- Do not claim tests passed unless they were actually run.
