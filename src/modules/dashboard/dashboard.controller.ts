import { Elysia } from "elysia";
import { dashboardService } from "./dashboard.service";
import { requireAuth } from "../../middleware/auth";
import { createSuccessResponse } from "../../shared/utils/response";

export const dashboardController = new Elysia({ prefix: "/api/v1/dashboard" })
  .use(requireAuth)
  .get("/summary", async (ctx: any) => {
    const { user } = ctx;
    const designerId = user.role === "DESIGNER" ? user.id : undefined;
    const summary = await dashboardService.getSummary(designerId);
    return createSuccessResponse("Dashboard summary retrieved successfully", { summary });
  });
