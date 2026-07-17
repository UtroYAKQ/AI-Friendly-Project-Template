import { IncomingMessage, ServerResponse } from "node:http";
import { routeNotFoundError } from "../shared/http-error";
import { fail, ok } from "../shared/response";
import { TodoService } from "./todo-service";

const DEMO_USER_ID = "user_001";

export const createTodoRoutes = (service: TodoService) => async (request: IncomingMessage, response: ServerResponse) => {
  const requestId = request.headers["x-request-id"]?.toString() ?? `req_${Date.now()}`;

  if (request.method === "OPTIONS") {
    response.writeHead(204, corsHeaders());
    return response.end();
  }

  try {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/api/v1/todos") {
      const page = Number(url.searchParams.get("page") ?? "1");
      const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
      const result = service.list({ userId: DEMO_USER_ID, page, pageSize });
      return sendJson(response, 200, ok(result.items, { requestId, pagination: { page, pageSize, total: result.total } }));
    }

    if (request.method === "POST" && url.pathname === "/api/v1/todos") {
      const body = await readJson(request);
      const todo = service.create({ userId: DEMO_USER_ID, title: body.title, description: body.description });
      return sendJson(response, 201, ok(todo, { requestId }));
    }

    const todoId = matchTodoId(url.pathname);

    if (request.method === "PATCH" && todoId) {
      const body = await readJson(request);
      const todo = service.update({ userId: DEMO_USER_ID, id: todoId, ...body });
      return sendJson(response, 200, ok(todo, { requestId }));
    }

    if (request.method === "DELETE" && todoId) {
      service.delete(DEMO_USER_ID, todoId);
      response.writeHead(204);
      return response.end();
    }

    const result = fail(routeNotFoundError(), requestId);
    return sendJson(response, result.status, result.body);
  } catch (error) {
    const result = fail(error, requestId);
    return sendJson(response, result.status, result.body);
  }
};

const readJson = async (request: IncomingMessage) => {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
};

const matchTodoId = (pathname: string) => {
  const match = pathname.match(/^\/api\/v1\/todos\/([^/]+)$/);
  return match?.[1] ?? null;
};

const sendJson = (response: ServerResponse, status: number, body: unknown) => {
  response.writeHead(status, { "content-type": "application/json", ...corsHeaders() });
  response.end(JSON.stringify(body, null, 2));
};

const corsHeaders = () => ({
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "access-control-allow-headers": "content-type,authorization,x-request-id",
});
