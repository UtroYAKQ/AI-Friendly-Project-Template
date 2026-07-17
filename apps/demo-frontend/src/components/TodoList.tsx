import { Todo } from "../api/todo-api";

type TodoListProps = {
  todos: Todo[];
  disabled: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export const TodoList = ({ todos, disabled, onToggle, onDelete }: TodoListProps) => {
  if (todos.length === 0) {
    return <p className="empty-state">No Todos yet. Add one to get started.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li className="todo-item" key={todo.id}>
          <label>
            <input
              checked={todo.completed}
              disabled={disabled}
              onChange={(event) => onToggle(todo.id, event.target.checked)}
              type="checkbox"
            />
            <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
          </label>
          <button disabled={disabled} onClick={() => onDelete(todo.id)} type="button">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};
