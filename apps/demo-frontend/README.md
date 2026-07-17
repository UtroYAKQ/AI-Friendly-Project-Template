# Demo Frontend

Minimal Todo UI showing page state, API client isolation, and small components.

## Structure

```text
src/
  App.tsx
  api/todo-api.ts
  components/TodoForm.tsx
  components/TodoList.tsx
  styles.css
```

## Commands

```bash
npm install
npm run dev
npm run test
```

## Environment

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Pattern

- `App.tsx` owns data loading and mutation state.
- Components receive props and emit events.
- `todo-api.ts` owns backend response parsing.
