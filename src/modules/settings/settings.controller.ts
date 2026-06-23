import { Elysia, t } from "elysia";
import { settingsService } from "./settings.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";

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
  })
  // CRUD Operations (SUPER_ADMIN only)
  .use(requireRole(["SUPER_ADMIN"]))
  
  // Categories
  .post("/categories", async ({ body }: any) => {
    const data = await settingsService.createCategory(body);
    return createSuccessResponse("Category created successfully", { category: data });
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 })
    })
  })
  .patch("/categories/:id", async ({ params: { id }, body, set }: any) => {
    const data = await settingsService.updateCategory(id, body);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Category not found");
    }
    return createSuccessResponse("Category updated successfully", { category: data });
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      isActive: t.Optional(t.Boolean())
    })
  })
  .delete("/categories/:id", async ({ params: { id }, set }: any) => {
    const data = await settingsService.deleteCategory(id);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Category not found");
    }
    return createSuccessResponse("Category deleted successfully", { category: data });
  })

  // Priorities
  .post("/priorities", async ({ body }: any) => {
    const data = await settingsService.createPriority(body);
    return createSuccessResponse("Priority created successfully", { priority: data });
  }, {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      level: t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH"), t.Literal("URGENT")])
    })
  })
  .patch("/priorities/:id", async ({ params: { id }, body, set }: any) => {
    const data = await settingsService.updatePriority(id, body);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Priority not found");
    }
    return createSuccessResponse("Priority updated successfully", { priority: data });
  }, {
    body: t.Object({
      name: t.Optional(t.String()),
      level: t.Optional(t.Union([t.Literal("LOW"), t.Literal("MEDIUM"), t.Literal("HIGH"), t.Literal("URGENT")])),
      isActive: t.Optional(t.Boolean())
    })
  })
  .delete("/priorities/:id", async ({ params: { id }, set }: any) => {
    const data = await settingsService.deletePriority(id);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Priority not found");
    }
    return createSuccessResponse("Priority deleted successfully", { priority: data });
  })

  // Pattern Sizes
  .post("/pattern-sizes", async ({ body }: any) => {
    const data = await settingsService.createPatternSize(body);
    return createSuccessResponse("Pattern size created successfully", { patternSize: data });
  }, {
    body: t.Object({
      size: t.Number()
    })
  })
  .patch("/pattern-sizes/:id", async ({ params: { id }, body, set }: any) => {
    const data = await settingsService.updatePatternSize(id, body);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Pattern size not found");
    }
    return createSuccessResponse("Pattern size updated successfully", { patternSize: data });
  }, {
    body: t.Object({
      size: t.Optional(t.Number()),
      isActive: t.Optional(t.Boolean())
    })
  })
  .delete("/pattern-sizes/:id", async ({ params: { id }, set }: any) => {
    const data = await settingsService.deletePatternSize(id);
    if (!data) {
      set.status = 404;
      return createErrorResponse("Pattern size not found");
    }
    return createSuccessResponse("Pattern size deleted successfully", { patternSize: data });
  });
