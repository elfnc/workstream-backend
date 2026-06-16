import { Elysia, t } from "elysia";
import { tasksService } from "./tasks.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse, createPaginationResponse } from "../../shared/utils/response";

export const tasksController = new Elysia({ prefix: "/api/v1/tasks" })
  .use(requireAuth)
  .get("/", async (ctx: any) => {
    const { query, user } = ctx;
    
    let designerId = query.designerId;
    if (user.role === "DESIGNER") {
      designerId = user.id; // force own tasks
    }

    const page = query.page ? parseInt(query.page as string) : 1;
    const limit = query.limit ? parseInt(query.limit as string) : 10;
    
    const params = {
      page,
      limit,
      status: query.status,
      designerId,
      categoryId: query.categoryId,
      priorityId: query.priorityId,
      patternSizeId: query.patternSizeId,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder || "desc"
    };

    const { items, total } = await tasksService.getTasks(params);
    const totalPages = Math.ceil(total / limit);

    return createPaginationResponse("Tasks retrieved successfully", items, { page, limit, total, totalPages });
  })
  .get("/board", async (ctx: any) => {
    const { user } = ctx;
    const designerId = user.role === "DESIGNER" ? user.id : undefined;
    const board = await tasksService.getBoard(designerId);
    return createSuccessResponse("Board retrieved successfully", { board });
  })
  .get("/:id", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot view other designer's task");
    }
    return createSuccessResponse("Task retrieved successfully", { task });
  })
  .use(requireRole(["SUPER_ADMIN"]))
  .post("/", async (ctx: any) => {
    const { body, user } = ctx;
    const newTask = await tasksService.createTask(body, user.id);
    return createSuccessResponse("Task created successfully", { task: newTask });
  }, {
    body: t.Object({
      title: t.String({ minLength: 1 }),
      referenceNumber: t.Optional(t.String()),
      description: t.Optional(t.String()),
      fileReference: t.Optional(t.String()),
      categoryId: t.String(),
      priorityId: t.String(),
      patternSizeId: t.String(),
      assignedToId: t.String(),
      dueDate: t.Optional(t.String()),
    })
  })
  .delete("/:id", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    try {
      const deleted = await tasksService.deleteTask(id, user.id);
      if (!deleted) {
        set.status = 404;
        return createErrorResponse("Task not found");
      }
      return createSuccessResponse("Task deleted successfully", { task: deleted });
    } catch (e: any) {
      set.status = 500;
      return createErrorResponse("Failed to delete task, it may have dependencies. " + e.message);
    }
  });

export const tasksPatchController = new Elysia({ prefix: "/api/v1/tasks" })
  .use(requireAuth)
  .use(requireRole(["SUPER_ADMIN", "DESIGNER"]))
  .patch("/:id", async (ctx: any) => {
    const { params: { id }, body, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot update other designer's task");
    }
    const updated = await tasksService.updateTask(id, body, user.id);
    return createSuccessResponse("Task updated successfully", { task: updated });
  }, {
    body: t.Object({
      title: t.Optional(t.String()),
      referenceNumber: t.Optional(t.String()),
      description: t.Optional(t.String()),
      fileReference: t.Optional(t.String()),
      categoryId: t.Optional(t.String()),
      priorityId: t.Optional(t.String()),
      patternSizeId: t.Optional(t.String()),
      assignedToId: t.Optional(t.String()),
      dueDate: t.Optional(t.String()),
    })
  })
  .patch("/:id/status", async (ctx: any) => {
    const { params: { id }, body: { status }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot update other designer's task");
    }
    const updated = await tasksService.updateStatus(id, status, user.id);
    return createSuccessResponse("Task status updated successfully", { task: updated });
  }, {
    body: t.Object({
      status: t.Union([
        t.Literal("QUEUE"), t.Literal("WORKING"), t.Literal("CHECKING"), 
        t.Literal("REVISION"), t.Literal("READY_UPLOAD"), t.Literal("DONE")
      ])
    })
  })
  .patch("/:id/progress", async (ctx: any) => {
    const { params: { id }, body: { progress, note }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot update other designer's task");
    }
    
    const isValidProgress = (status: string, p: number) => {
      switch(status) {
        case "QUEUE": return p === 0;
        case "WORKING": return p >= 15 && p <= 80;
        case "CHECKING": return p >= 80 && p <= 90;
        case "REVISION": return p >= 50 && p <= 85;
        case "READY_UPLOAD": return p >= 90 && p <= 99;
        case "DONE": return p === 100;
        default: return false;
      }
    };

    if (!isValidProgress(task.status, progress)) {
      set.status = 400;
      return createErrorResponse(`Invalid progress for status ${task.status}`);
    }

    const updated = await tasksService.updateProgress(id, progress, note || "", user.id);
    return createSuccessResponse("Task progress updated successfully", { task: updated });
  }, {
    body: t.Object({
      progress: t.Number({ minimum: 0, maximum: 100 }),
      note: t.Optional(t.String())
    })
  });
