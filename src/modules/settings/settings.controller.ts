import { Elysia } from "elysia";
import { settingsService } from "./settings.service";
import { requireAuth } from "../../middleware/auth";
import { createSuccessResponse } from "../../shared/utils/response";

export const settingsController = new Elysia({ prefix: "/api/v1/settings" })
  .use(requireAuth)
  .get("/categories", async () => {
    const data = await settingsService.getCategories();
    return createSuccessResponse("Categories retrieved successfully", { categories: data });
  })
  .get("/priorities", async () => {
    const data = await settingsService.getPriorities();
    return createSuccessResponse("Priorities retrieved successfully", { priorities: data });
  })
  .get("/pattern-sizes", async () => {
    const data = await settingsService.getPatternSizes();
    return createSuccessResponse("Pattern sizes retrieved successfully", { patternSizes: data });
  });
