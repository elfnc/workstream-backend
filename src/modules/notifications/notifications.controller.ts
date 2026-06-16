import { Elysia } from "elysia";
import { notificationsService } from "./notifications.service";
import { requireAuth } from "../../middleware/auth";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";

export const notificationsController = new Elysia({ prefix: "/api/v1/notifications" })
  .use(requireAuth)
  .get("/", async (ctx: any) => {
    const { user } = ctx;
    const items = await notificationsService.getNotifications(user.id);
    return createSuccessResponse("Notifications retrieved successfully", { notifications: items });
  })
  .patch("/:id/read", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    const [updated] = await notificationsService.markAsRead(id, user.id);
    if (!updated) {
      set.status = 404;
      return createErrorResponse("Notification not found");
    }
    return createSuccessResponse("Notification marked as read successfully", { notification: updated });
  })
  .patch("/read-all", async (ctx: any) => {
    const { user } = ctx;
    const updated = await notificationsService.markAllAsRead(user.id);
    return createSuccessResponse("All notifications marked as read successfully", { notifications: updated });
  });
