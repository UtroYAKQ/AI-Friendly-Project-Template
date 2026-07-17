import { Todo } from "./todo-model";

export class TodoRepository {
  private readonly todos = new Map<string, Todo>();
  private nextId = 1;

  listByUser(userId: string, page: number, pageSize: number) {
    const allItems = [...this.todos.values()]
      .filter((todo) => todo.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    const offset = (page - 1) * pageSize;

    return {
      items: allItems.slice(offset, offset + pageSize),
      total: allItems.length,
    };
  }

  findById(id: string) {
    return this.todos.get(id) ?? null;
  }

  save(todo: Omit<Todo, "id">) {
    const id = `todo_${String(this.nextId++).padStart(3, "0")}`;
    const createdTodo = { ...todo, id };
    this.todos.set(id, createdTodo);
    return createdTodo;
  }

  update(todo: Todo) {
    this.todos.set(todo.id, todo);
    return todo;
  }

  delete(id: string) {
    return this.todos.delete(id);
  }
}
