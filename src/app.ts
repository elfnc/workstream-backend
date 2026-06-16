import { Elysia } from "elysia";
import { corsPlugin } from "./config/cors";
import { globalErrorHandler } from "./shared/errors/errorHandler";
import { authController } from "./modules/auth/auth.controller";
import { usersController } from "./modules/users/users.controller";
import { settingsController } from "./modules/settings/settings.controller";
import { tasksController, tasksPatchController } from "./modules/tasks/tasks.controller";

export const app = new Elysia()
  .use(corsPlugin)
  .use(globalErrorHandler)
  .get("/", () => {
    return {
      success: true,
      message: "Workstream API is running"
    };
  })
  .use(authController)
  .use(usersController)
  .use(settingsController)
  .use(tasksController)
  .use(tasksPatchController);
