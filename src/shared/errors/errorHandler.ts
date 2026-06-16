import { Elysia } from "elysia";
import { logger } from "../../config/logger";
import { createErrorResponse } from "../utils/response";

export const globalErrorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    logger.error(`[Error] ${code}: ${error.message}`);
    
    if (code === "NOT_FOUND") {
      set.status = 404;
      return createErrorResponse("Resource not found");
    }

    if (code === "VALIDATION") {
      set.status = 400;
      return createErrorResponse("Validation failed", [{ message: error.message }]);
    }

    set.status = 500;
    return createErrorResponse("Internal server error");
  });
