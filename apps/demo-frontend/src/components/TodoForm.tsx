import { FormEvent, useState } from "react";

type TodoFormProps = {
  disabled: boolean;
  onSubmit: (title: string) => Promise<void>;
};

export const TodoForm = ({ disabled, onSubmit }: TodoFormProps) => {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      return;
    }

    await onSubmit(normalizedTitle);
    setTitle("");
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        aria-label="Todo title"
        disabled={disabled}
        maxLength={120}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Add a Todo"
        value={title}
      />
      <button disabled={disabled || !title.trim()} type="submit">
        Add
      </button>
    </form>
  );
};
