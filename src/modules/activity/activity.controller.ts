import { Elysia } from "elysia";
import { activityService } from "./activity.service";
import { requireAuth } from "../../middleware/auth";
import { createPaginationResponse } from "../../shared/utils/response";

export const activityController = new Elysia({ prefix: "/api/v1/activity" })
  .use(requireAuth)
  .get("/", async (ctx: any) => {
    const { query, user } = ctx;
    
    let userId = query.userId;
    // According to TODO: DESIGNER can view own related activity
    if (user.role === "DESIGNER") {
      userId = user.id; // Force own activities
    }

    const page = query.page ? parseInt(query.page as string) : 1;
    const limit = query.limit ? parseInt(query.limit as string) : 20;

    const params = {
      page,
      limit,
      userId,
      taskId: query.taskId,
      action: query.action,
      startDate: query.startDate,
      endDate: query.endDate,
    };

    const { items, total } = await activityService.getActivities(params);
    const totalPages = Math.ceil(total / limit);

    return createPaginationResponse("Activities retrieved successfully", items, { page, limit, total, totalPages });
  });
