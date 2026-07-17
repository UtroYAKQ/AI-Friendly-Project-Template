import { useEffect, useState } from "react";
import { createTodo, deleteTodo, listTodos, Todo, updateTodo } from "./api/todo-api";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import "./styles.css";

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listTodos()
      .then(setTodos)
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Failed to load Todos"))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (title: string) => {
    await runMutation(async () => {
      const todo = await createTodo(title);
      setTodos((currentTodos) => [todo, ...currentTodos]);
    });
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await runMutation(async () => {
      const todo = await updateTodo(id, completed);
      setTodos((currentTodos) => currentTodos.map((item) => (item.id === id ? todo : item)));
    });
  };

  const handleDelete = async (id: string) => {
    await runMutation(async () => {
      await deleteTodo(id);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    });
  };

  const runMutation = async (mutation: () => Promise<void>) => {
    setSaving(true);
    setError(null);

    try {
      await mutation();
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : "Request failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="app-shell">
      <section className="todo-card">
        <header>
          <p className="eyebrow">AI-friendly demo</p>
          <h1>Todo App</h1>
          <p>Small frontend example that follows the documented API contract.</p>
        </header>

        <TodoForm disabled={saving} onSubmit={handleCreate} />

        {error && <p className="error-message">{error}</p>}
        {loading ? <p>Loading Todos...</p> : <TodoList disabled={saving} onDelete={handleDelete} onToggle={handleToggle} todos={todos} />}
      </section>
    </main>
  );
};

export default App;
