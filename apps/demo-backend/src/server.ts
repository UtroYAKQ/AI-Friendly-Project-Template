import { createServer } from "node:http";
import { TodoRepository } from "./todos/todo-repository";
import { createTodoRoutes } from "./todos/todo-routes";
import { TodoService } from "./todos/todo-service";

const port = Number(process.env.PORT ?? "3000");
const repository = new TodoRepository();
const service = new TodoService(repository);
const server = createServer(createTodoRoutes(service));

server.listen(port, () => {
  console.log(`Demo backend listening on http://localhost:${port}`);
});
