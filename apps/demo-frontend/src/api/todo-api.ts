export type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  meta: Record<string, unknown>;
};

type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: Record<string, unknown>;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const listTodos = async () => {
  return request<Todo[]>("/todos");
};

export const createTodo = async (title: string) => {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
};

export const updateTodo = async (id: string, completed: boolean) => {
  return request<Todo>(`/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
};

export const deleteTodo = async (id: string) => {
  const response = await fetch(`${apiBaseUrl}/todos/${id}`, { method: "DELETE" });

  if (!response.ok) {
    throw new Error("Failed to delete Todo");
  }
};

const request = async <T>(path: string, init: RequestInit = {}) => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init.headers,
    },
  });

  const payload = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!payload.success) {
    throw new Error(`${payload.error.code}: ${payload.error.message}`);
  }

  return payload.data;
};
