import { Elysia } from "elysia";
import { workloadService } from "./workload.service";
import { requireAuth } from "../../middleware/auth";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";

export const workloadController = new Elysia({ prefix: "/api/v1/workload" })
  .use(requireAuth)
  .get("/", async (ctx: any) => {
    const { user } = ctx;
    const designerId = user.role === "DESIGNER" ? user.id : undefined;
    const workload = await workloadService.getWorkload(designerId);
    return createSuccessResponse("Workload retrieved successfully", { workload });
  })
  .get("/:designerId", async (ctx: any) => {
    const { params: { designerId }, user, set } = ctx;
    if (user.role === "DESIGNER" && designerId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot view other designer's workload detail");
    }
    const detail = await workloadService.getWorkloadDetail(designerId);
    return createSuccessResponse("Workload detail retrieved successfully", { detail });
  });
