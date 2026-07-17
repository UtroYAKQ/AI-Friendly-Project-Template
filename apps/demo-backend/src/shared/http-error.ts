export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "TODO_NOT_FOUND"
  | "INTERNAL_ERROR";

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message);
  }
}

export const validationError = (message: string, details: Record<string, unknown> = {}) =>
  new HttpError(422, "VALIDATION_ERROR", message, details);

export const notFoundError = (message = "Todo does not exist") =>
  new HttpError(404, "TODO_NOT_FOUND", message);

export const routeNotFoundError = (message = "Route not found") =>
  new HttpError(404, "NOT_FOUND", message);
