# Database Schema

The demo uses an in-memory repository at runtime, but real projects should keep this document aligned with migration files in `apps/demo-backend/migrations/`.

## Table: users

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| id | varchar(32) | yes | Primary key, example `user_001` |
| email | varchar(255) | yes | Unique, normalized lowercase |
| password_hash | varchar(255) | yes | Never returned by APIs |
| display_name | varchar(80) | yes | User-facing name |
| created_at | timestamp | yes | UTC |
| updated_at | timestamp | yes | UTC |

Indexes:

- `users_email_unique` unique on `email`

## Table: todos

| Column | Type | Required | Notes |
| --- | --- | --- | --- |
| id | varchar(32) | yes | Primary key, example `todo_001` |
| user_id | varchar(32) | yes | Foreign key to `users.id` |
| title | varchar(120) | yes | User-visible title |
| description | text | no | Optional details |
| completed | boolean | yes | Default `false` |
| completed_at | timestamp | no | Set when completed becomes true |
| deleted_at | timestamp | no | Soft delete timestamp |
| created_at | timestamp | yes | UTC |
| updated_at | timestamp | yes | UTC |

Indexes:

- `todos_user_id_created_at_idx` on `(user_id, created_at desc)`
- `todos_user_id_completed_idx` on `(user_id, completed)`

## Migration Files

Demo migration files:

- `apps/demo-backend/migrations/0001_create_users_and_todos.sql`
- `apps/demo-backend/migrations/0001_create_users_and_todos.down.sql`

## Migration Rules

- Every schema change must include a migration and rollback strategy.
- Backfill large columns in batches.
- Never drop columns used by deployed application versions.

