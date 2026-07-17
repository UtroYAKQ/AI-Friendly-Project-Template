# AI Project Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable AI-facing project documentation demos and a minimal Todo frontend/backend demo.

**Architecture:** Documentation establishes project rules, business contracts, security, testing, deployment, and AI execution flow. Demo apps use a small Todo domain to show how backend APIs and frontend UI should be organized without binding the template to a heavy framework.

**Tech Stack:** Markdown docs, TypeScript demo backend, React-style frontend components, Docker Compose examples.

---

## File Structure

- Modify `AGENTS.md`: Codex/agent rules and required reading order.
- Modify `.claude/CLAUDE.md`: Claude project instructions and rule imports.
- Modify `.claude/rules/api.md`: API design rules and examples.
- Modify `docs/*.md`: reusable project documentation demos.
- Create `apps/demo-backend/*`: minimal Todo API example with in-memory repository.
- Create `apps/demo-frontend/*`: minimal Todo UI example with API client.
- Modify `docker/docker-*/docker-compose.yml`: local/dev/prod deployment examples.

## Tasks

### Task 1: Project AI Documentation

**Files:**
- Modify: `AGENTS.md`
- Modify: `.claude/CLAUDE.md`
- Modify: `.claude/rules/api.md`
- Modify: `docs/ai-guide.md`
- Modify: `docs/coding-standards.md`

- [x] Write AI execution rules, code style, and API conventions.
- [x] Include concrete examples for agents to copy.
- [x] Keep guidance framework-neutral and concise.

### Task 2: Product And Contract Docs

**Files:**
- Modify: `docs/architecture.md`
- Modify: `docs/business-flow.md`
- Modify: `docs/api-contracts.md`
- Modify: `docs/database-schema.md`
- Modify: `docs/error-codes.md`

- [x] Document Todo demo architecture, flows, contracts, schema, and errors.
- [x] Include request/response examples and acceptance checks.

### Task 3: Operations Docs

**Files:**
- Modify: `docs/testing.md`
- Modify: `docs/security.md`
- Modify: `docs/deployment.md`
- Modify: `docker/docker-dev/docker-compose.yml`
- Modify: `docker/docker-local/docker-compose.yml`
- Modify: `docker/docker-prod/docker-compose.yml`

- [x] Document test strategy, security baseline, and deployments.
- [x] Add Docker Compose demos for common environments.

### Task 4: Backend Demo

**Files:**
- Create: `apps/demo-backend/README.md`
- Create: `apps/demo-backend/package.json`
- Create: `apps/demo-backend/src/server.ts`
- Create: `apps/demo-backend/src/todos/todo-model.ts`
- Create: `apps/demo-backend/src/todos/todo-repository.ts`
- Create: `apps/demo-backend/src/todos/todo-service.ts`
- Create: `apps/demo-backend/src/todos/todo-routes.ts`
- Create: `apps/demo-backend/src/shared/http-error.ts`
- Create: `apps/demo-backend/src/shared/response.ts`

- [x] Add minimal Todo API with validation and consistent responses.
- [x] Keep persistence in-memory for easy reading.

### Task 5: Frontend Demo

**Files:**
- Create: `apps/demo-frontend/README.md`
- Create: `apps/demo-frontend/package.json`
- Create: `apps/demo-frontend/src/App.tsx`
- Create: `apps/demo-frontend/src/api/todo-api.ts`
- Create: `apps/demo-frontend/src/components/TodoList.tsx`
- Create: `apps/demo-frontend/src/components/TodoForm.tsx`
- Create: `apps/demo-frontend/src/styles.css`

- [x] Add minimal Todo page showing API client, state, and components.
- [x] Keep UI small and adaptable to any React stack.

## Verification

- Read generated files to check for empty placeholders.
- Confirm directory structure is complete.
- No dependency install is required for this template update.
