export type Todo = {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoInput = {
  userId: string;
  title: string;
  description?: string;
};

export type UpdateTodoInput = {
  userId: string;
  id: string;
  title?: string;
  description?: string | null;
  completed?: boolean;
};

export type TodoListQuery = {
  userId: string;
  page: number;
  pageSize: number;
};
