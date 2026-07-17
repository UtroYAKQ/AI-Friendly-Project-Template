# Database Migrations

This folder contains database migration examples for the demo backend.

## Naming

Use a numeric prefix and a short action name:

```text
0001_create_users_and_todos.sql
0001_create_users_and_todos.down.sql
0002_add_todo_priority.sql
0002_add_todo_priority.down.sql
```

## Rules

- Every forward migration must have a matching rollback migration.
- Keep schema documentation in `docs/database-schema.md` aligned with migrations.
- Do not put business logic in migration files.
- Prefer additive changes for production systems.
- Backfill large tables in batches.

## Demo

`0001_create_users_and_todos.sql` creates the demo `users` and `todos` tables.
`0001_create_users_and_todos.down.sql` drops them in reverse dependency order.
