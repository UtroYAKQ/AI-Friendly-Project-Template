import { notFoundError, validationError } from "../shared/http-error";
import { CreateTodoInput, TodoListQuery, UpdateTodoInput } from "./todo-model";
import { TodoRepository } from "./todo-repository";

const MAX_TITLE_LENGTH = 120;

export class TodoService {
  constructor(private readonly repository: TodoRepository) {}

  list(query: TodoListQuery) {
    return this.repository.listByUser(query.userId, query.page, query.pageSize);
  }

  create(input: CreateTodoInput) {
    const title = this.normalizeTitle(input.title);
    const now = new Date().toISOString();

    return this.repository.save({
      userId: input.userId,
      title,
      description: input.description?.trim() || null,
      completed: false,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(input: UpdateTodoInput) {
    const existing = this.repository.findById(input.id);

    if (!existing || existing.userId !== input.userId) {
      throw notFoundError();
    }

    const completed = input.completed ?? existing.completed;
    const now = new Date().toISOString();

    return this.repository.update({
      ...existing,
      title: input.title === undefined ? existing.title : this.normalizeTitle(input.title),
      description: input.description === undefined ? existing.description : input.description?.trim() || null,
      completed,
      completedAt: completed ? existing.completedAt ?? now : null,
      updatedAt: now,
    });
  }

  delete(userId: string, id: string) {
    const existing = this.repository.findById(id);

    if (!existing || existing.userId !== userId) {
      throw notFoundError();
    }

    this.repository.delete(id);
  }

  private normalizeTitle(title: string) {
    const normalized = title.trim();

    if (!normalized) {
      throw validationError("Title is required", { field: "title" });
    }

    if (normalized.length > MAX_TITLE_LENGTH) {
      throw validationError("Title must be 120 characters or less", { field: "title" });
    }

    return normalized;
  }
}
