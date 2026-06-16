import { Elysia } from "elysia";
import { corsPlugin } from "./config/cors";
import { staticPlugin } from "@elysiajs/static";
import { globalErrorHandler } from "./shared/errors/errorHandler";
import { authController } from "./modules/auth/auth.controller";
import { usersController } from "./modules/users/users.controller";
import { settingsController } from "./modules/settings/settings.controller";
import { tasksController, tasksPatchController } from "./modules/tasks/tasks.controller";
import { commentsController } from "./modules/comments/comments.controller";
import { revisionsController } from "./modules/revisions/revisions.controller";
import { activityController } from "./modules/activity/activity.controller";
import { workloadController } from "./modules/workload/workload.controller";
import { dashboardController } from "./modules/dashboard/dashboard.controller";
import { notificationsController } from "./modules/notifications/notifications.controller";
import { attachmentsController, attachmentsDeleteController } from "./modules/attachments/attachments.controller";

export const app = new Elysia()
  .use(corsPlugin)
  .use(staticPlugin({ assets: "uploads", prefix: "/uploads" }))
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
  .use(tasksPatchController)
  .use(commentsController)
  .use(revisionsController)
  .use(activityController)
  .use(workloadController)
  .use(dashboardController)
  .use(notificationsController)
  .use(attachmentsController)
  .use(attachmentsDeleteController);
