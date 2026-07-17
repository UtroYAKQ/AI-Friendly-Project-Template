import { HttpError } from "./http-error";

export type ApiMeta = {
  requestId: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
};

export const ok = <T>(data: T, meta: ApiMeta) => ({
  success: true as const,
  data,
  meta,
});

export const fail = (error: unknown, requestId: string) => {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: {
        success: false as const,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        meta: { requestId },
      },
    };
  }

  return {
    status: 500,
    body: {
      success: false as const,
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected server error",
      },
      meta: { requestId },
    },
  };
};
