# AI-Friendly Project Template

This repository is a learning template for building **AI-friendly software projects**. Its goal is not only to provide a demo app, but also to show how to organize project knowledge so tools like Codex and Claude Code can understand the project, follow constraints, and produce more reliable code.

The core idea is simple:

> AI writes better code when the project has clear context, stable contracts, explicit boundaries, runnable examples, and verification rules.

## Who This Is For

Use this template if you want to learn how to:

- Design a project structure that is easy for AI agents to read.
- Separate product knowledge from tool-specific AI instructions.
- Give AI enough context before asking it to implement features.
- Keep documentation, API contracts, database design, tests, and deployment notes in sync.
- Build small demo apps that teach future contributors the expected code style.

## What Makes A Project AI-Friendly

A normal project often relies on undocumented team knowledge. An AI-friendly project makes that knowledge explicit.

| Area | What AI Needs | Where This Template Puts It |
| --- | --- | --- |
| Project purpose | What the system does and why it exists | `README.md` |
| Agent workflow | How AI should approach tasks | `docs/ai-guide.md` |
| Architecture | Module boundaries and dependency rules | `docs/architecture.md` |
| Business logic | User flows and acceptance criteria | `docs/business-flow.md` |
| API contract | Request/response shapes and status codes | `docs/api-contracts.md` |
| Database design | Tables, fields, indexes, and migration rules | `docs/database-schema.md` |
| Database migrations | Executable schema changes and rollback scripts | `apps/demo-backend/migrations/` |
| Error handling | Stable machine-readable error codes | `docs/error-codes.md` |
| Code style | Naming, layering, logging, validation | `docs/coding-standards.md` |
| Testing | What should be tested and how | `docs/testing.md` |
| Security | Auth, permissions, sensitive data rules | `docs/security.md` |
| Deployment | Env vars, Docker, production checklist | `docs/deployment.md` |
| Tool rules | Codex or Claude Code-specific behavior | `AGENTS.md`, `.claude/CLAUDE.md` |

## Repository Structure

```text
apps/
  demo-backend/          Minimal Todo API example
    migrations/          Database migration examples
  demo-frontend/         Minimal Todo UI example

docs/
  ai-guide.md            Shared workflow for AI-assisted development
  architecture.md        System boundaries and dependency direction
  business-flow.md       Product flows and acceptance criteria
  api-contracts.md       API request/response examples
  database-schema.md     Tables, fields, indexes, migration rules
  error-codes.md         Stable backend error codes
  coding-standards.md    Naming, layering, validation, logging rules
  testing.md             Unit/integration/E2E test strategy
  security.md            Auth, authorization, validation, secrets
  deployment.md          Local/dev/prod deployment notes

docker/
  docker-local/          Local full-stack demo compose file
  docker-dev/            Shared development compose file
  docker-prod/           Production-style compose example

.claude/
  CLAUDE.md              Claude Code-specific project instructions
  rules/api.md           Claude Code API rules

.codex/
  AGENTS.md              Codex local rules for `.codex/`
  config.toml            Codex local config placeholder

AGENTS.md                Codex project instructions
.env.example             Safe example environment variables
.gitignore               Ignore rules for generated and local files
```

## Important Design Principle

Do not mix AI tool configuration.

- `AGENTS.md` is for **Codex**.
- `.claude/CLAUDE.md` is for **Claude Code**.
- `docs/` is for **shared product and engineering knowledge**.

This separation matters because different AI tools read different files automatically. Shared rules belong in `docs/`; tool-specific behavior belongs in that tool's own config file.

## How To Read This Project

If you are learning from this repository, read files in this order:

1. `README.md` - understand the purpose and structure.
2. `docs/ai-guide.md` - learn the AI workflow.
3. `docs/architecture.md` - understand system boundaries.
4. `docs/business-flow.md` - understand the Todo demo domain.
5. `docs/api-contracts.md` - learn how API contracts are documented.
6. `docs/database-schema.md` - learn how persistence expectations are documented.
7. `apps/demo-backend/migrations/` - learn how schema changes are implemented.
8. `docs/coding-standards.md` - learn implementation rules.
9. `docs/testing.md` and `docs/security.md` - learn quality and safety expectations.
10. `apps/demo-backend/README.md` and `apps/demo-frontend/README.md` - see the docs reflected in code.

## How To Use This Template In Your Own Project

### 1. Start With The Business Flow

Before asking AI to write code, describe the real user workflow in `docs/business-flow.md`.

Good example:

```text
Flow: Create Todo
1. User enters a title.
2. Backend validates the title is not empty and is at most 120 characters.
3. Backend creates a Todo owned by the current user.
4. Frontend adds the new Todo to the top of the list.

Acceptance criteria:
- Empty title returns VALIDATION_ERROR.
- Unauthenticated request returns UNAUTHORIZED.
- Created Todo starts with completed = false.
```

Bad example:

```text
Users can manage todos.
```

The bad version is too vague. AI has to guess validation, ownership, response shape, and edge cases.

### 2. Define API Contracts Before Implementation

Write the expected request and response in `docs/api-contracts.md` before asking AI to implement the endpoint.

Good API contract docs include:

- HTTP method and path.
- Auth requirement.
- Request body example.
- Success response example.
- Error response examples.
- Pagination format for list APIs.
- Stable error codes.

This prevents AI from inventing inconsistent response formats.

### 3. Keep Schema Docs And Migrations Together

`docs/database-schema.md` explains the design intent. `apps/demo-backend/migrations/` stores executable database changes.

They should move together:

```text
Every table, field, index, or constraint change should update:
1. docs/database-schema.md
2. apps/demo-backend/migrations/
3. Related API, business-flow, and testing docs when behavior changes
```

This helps AI avoid changing application code without adding the database migration needed to run it.

### 4. Document Data Ownership

In `docs/database-schema.md`, do not only list fields. Explain ownership and important constraints.

Example:

```text
Each Todo belongs to exactly one user through todos.user_id.
Users can only read and mutate their own Todos.
Normal list queries exclude rows with deleted_at set.
```

This helps AI avoid security bugs like returning another user's data.

### 5. Make Architecture Boundaries Explicit

In `docs/architecture.md`, tell AI where logic belongs.

Example:

```text
route/controller -> service -> repository -> database
```

Then explain each layer:

- Routes parse HTTP input and output.
- Services enforce business rules.
- Repositories handle persistence.
- Shared utilities handle errors, responses, config, and logging.

Without this, AI may put business logic directly inside route handlers or mix database code into UI components.

### 6. Keep Coding Standards Concrete

`docs/coding-standards.md` should include specific rules AI can follow.

Good rules:

- Files use kebab-case: `todo-service.ts`.
- Types use PascalCase: `TodoService`.
- Functions use camelCase: `createTodo`.
- API errors use codes from `docs/error-codes.md`.
- Do not expose stack traces in API responses.

Avoid vague rules like:

```text
Write clean code.
```

AI cannot reliably act on vague standards.

### 7. Add Small Demo Code

The demo apps are intentionally small. Their purpose is to teach patterns, not to be production frameworks.

Backend demo shows:

- Route/service/repository separation.
- Consistent response envelope.
- Typed HTTP errors.
- Input validation.
- Ownership-ready Todo model.

Frontend demo shows:

- Page-level state management.
- Presentational components.
- Central API client.
- Loading, empty, error, and success states.

When your real project grows, keep one or two simple examples like this. AI often copies nearby patterns.

## How To Ask AI For Better Code

### Weak Prompt

```text
Add todo edit function.
```

This is weak because AI must guess UI behavior, API shape, validation, tests, and docs.

### Strong Prompt

```text
Add Todo title editing.

Read these files first:
- docs/business-flow.md
- docs/api-contracts.md
- docs/coding-standards.md
- docs/error-codes.md

Requirements:
- Use PATCH /api/v1/todos/{id}.
- Keep the API response envelope unchanged.
- Validate title length using the existing backend rule.
- Update frontend state without reloading the page.
- Add or update tests for success, empty title, and missing Todo.
- Update docs if any contract changes.
```

The strong prompt gives AI context, boundaries, and acceptance criteria.

## Recommended AI Workflow

For any non-trivial change, use this loop:

```text
1. Read relevant docs.
2. Summarize current behavior.
3. Identify files to change.
4. Make a small plan.
5. Implement the smallest useful change.
6. Run focused validation.
7. Update docs if behavior changed.
8. Report what changed and what was verified.
```

This workflow is documented in more detail in `docs/ai-guide.md`.

## Demo App Overview

The demo domain is a personal Todo app.

### Backend

Path: `apps/demo-backend/`

Key files:

- `src/server.ts` - creates the HTTP server.
- `src/todos/todo-routes.ts` - maps HTTP requests to service calls.
- `src/todos/todo-service.ts` - validates and applies business rules.
- `src/todos/todo-repository.ts` - stores Todos in memory.
- `src/shared/response.ts` - creates success/error response envelopes.
- src/shared/http-error.ts - defines typed API errors.
- migrations/0001_create_users_and_todos.sql - creates demo database tables.
- migrations/0001_create_users_and_todos.down.sql - rolls back demo database tables.

### Frontend

Path: `apps/demo-frontend/`

Key files:

- `src/App.tsx` - coordinates loading, mutation, and page state.
- `src/api/todo-api.ts` - owns all backend API calls.
- `src/components/TodoForm.tsx` - renders the create form.
- `src/components/TodoList.tsx` - renders Todos and user actions.
- `src/styles.css` - keeps demo styling simple and local.

## Running The Demo

Install dependencies inside each demo app if you want to run them directly:

```bash
cd apps/demo-backend
npm install
npm run dev
```

```bash
cd apps/demo-frontend
npm install
npm run dev
```

Or use Docker Compose from the repository root:

```bash
docker compose -f docker/docker-local/docker-compose.yml up --build
```

Expected local URLs:

- Backend: `http://localhost:3000/api/v1/todos`
- Frontend: `http://localhost:5173`

## Environment Variables

Copy `.env.example` when creating real local environment files.

```bash
cp .env.example .env
```

Never commit real `.env` files. `.gitignore` keeps `.env` and `.env.*` ignored while allowing `.env.example` to be committed.

## Database Migration Rules

Migration files live in `apps/demo-backend/migrations/`.

Recommended naming:

```text
0001_create_users_and_todos.sql
0001_create_users_and_todos.down.sql
0002_add_todo_priority.sql
0002_add_todo_priority.down.sql
```

Rules:

- Every forward migration should have a matching rollback migration.
- Migration files describe database structure or data movement, not business logic.
- Schema changes must update `docs/database-schema.md`.
- Field meaning changes should also update API, business-flow, and testing docs.
- Production column drops should only happen after deployed app versions no longer read the column.

## Documentation Maintenance Rules

When code changes, update docs in the same task:

| If You Change | Also Update |
| --- | --- |
| API path, request, response, or status | `docs/api-contracts.md` |
| Business behavior or acceptance criteria | `docs/business-flow.md` |
| Tables, fields, indexes, migrations | `docs/database-schema.md`, `apps/demo-backend/migrations/` |
| Error code or error meaning | `docs/error-codes.md` |
| Auth, permissions, validation, secrets | `docs/security.md` |
| Test command or test strategy | `docs/testing.md` |
| Ports, env vars, Docker, deployment flow | `docs/deployment.md` |
| Coding pattern or naming rule | `docs/coding-standards.md` |

This is one of the most important habits for AI-friendly projects: **docs and code must evolve together**.

## Project Checklist

Use this checklist when adapting the template to a real project.

- [ ] `README.md` explains project purpose, structure, setup, and learning path.
- [ ] `AGENTS.md` contains Codex-only instructions.
- [ ] `.claude/CLAUDE.md` contains Claude Code-only instructions.
- [ ] Shared rules live in `docs/`, not inside one AI tool's private config.
- [ ] `docs/business-flow.md` describes real user flows and acceptance criteria.
- [ ] `docs/api-contracts.md` includes concrete request/response examples.
- [ ] `docs/database-schema.md` documents ownership, indexes, and migration rules.
- [ ] `apps/demo-backend/migrations/` contains executable migrations and rollback migrations.
- [ ] `docs/error-codes.md` contains stable machine-readable error codes.
- [ ] `docs/coding-standards.md` gives specific, enforceable implementation rules.
- [ ] `docs/testing.md` explains what must be tested and how to run tests.
- [ ] `docs/security.md` documents auth, permissions, validation, and secrets.
- [ ] `docs/deployment.md` documents environments, env vars, and release checks.
- [ ] Demo code exists for the most important backend and frontend patterns.
- [ ] `.env.example` lists safe example config values.
- [ ] `.gitignore` excludes generated files, secrets, caches, and local data.

## Common Mistakes

Avoid these patterns:

- Putting product requirements only in AI chat history.
- Letting API response formats vary between endpoints.
- Mixing Codex instructions and Claude Code instructions in the same file.
- Asking AI to implement features before documenting the contract.
- Having docs that say one thing and code that does another.
- Changing database structure without adding a migration.
- Keeping only complex production code and no small example for AI to copy.
- Committing real secrets, local databases, generated builds, or dependency folders.

## Why This Works

AI coding tools are strongest when they can copy consistent local patterns and weakest when they must infer hidden intent. This template reduces guessing by giving AI:

- A clear entrypoint.
- Explicit project boundaries.
- Concrete examples.
- Stable contracts.
- Verification expectations.
- Separate instructions for different AI tools.
- Database migration files that make schema changes executable.

The result is not perfect automation, but it gives AI a much better chance of producing code that matches your project instead of generic code from memory.

