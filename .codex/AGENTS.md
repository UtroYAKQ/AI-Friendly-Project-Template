# Codex Local Rules

This file adds Codex-specific guidance for work inside `.codex/`.

## Behavior

- Read root `AGENTS.md` before changing project files.
- Use `docs/ai-guide.md` as the task workflow.
- Keep final responses concise and include changed file paths.
- Do not commit changes unless the user explicitly asks.
- Keep Codex-local behavior inside `.codex/` files.

## Preferred Commands

- Search files with `rg` or `Get-ChildItem`.
- Edit files with focused patches.
- Validate docs-only changes by checking for empty files and inconsistent paths.
