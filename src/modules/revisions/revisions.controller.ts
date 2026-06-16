import { Elysia, t } from "elysia";
import { revisionsService } from "./revisions.service";
import { tasksService } from "../tasks/tasks.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";

export const revisionsController = new Elysia({ prefix: "/api/v1/tasks/:id/revisions" })
  .use(requireAuth)
  .get("/", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot view revisions of other designer's task");
    }
    const revisions = await revisionsService.getRevisions(id);
    return createSuccessResponse("Revisions retrieved successfully", { revisions });
  })
  .use(requireRole(["SUPER_ADMIN", "DESIGNER"]))
  .post("/", async (ctx: any) => {
    const { params: { id }, body: { note }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot add revision on other designer's task");
    }
    const newRevision = await revisionsService.addRevision(id, user.id, note);
    return createSuccessResponse("Revision added successfully", { revision: newRevision });
  }, {
    body: t.Object({
      note: t.String({ minLength: 1 })
    })
  });
