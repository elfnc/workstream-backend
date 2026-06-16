import { Elysia } from "elysia";
import { corsPlugin } from "./config/cors";
import { globalErrorHandler } from "./shared/errors/errorHandler";

export const app = new Elysia()
  .use(corsPlugin)
  .use(globalErrorHandler)
  .get("/", () => {
    return {
      success: true,
      message: "Workstream API is running"
    };
  });
