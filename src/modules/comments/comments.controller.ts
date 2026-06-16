import { Elysia, t } from "elysia";
import { commentsService } from "./comments.service";
import { tasksService } from "../tasks/tasks.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";

export const commentsController = new Elysia({ prefix: "/api/v1/tasks/:id/comments" })
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
      return createErrorResponse("Forbidden: Cannot view comments of other designer's task");
    }
    const comments = await commentsService.getComments(id);
    return createSuccessResponse("Comments retrieved successfully", { comments });
  })
  .use(requireRole(["SUPER_ADMIN", "DESIGNER"]))
  .post("/", async (ctx: any) => {
    const { params: { id }, body: { comment }, user, set } = ctx;
    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot comment on other designer's task");
    }
    const newComment = await commentsService.addComment(id, user.id, comment);
    return createSuccessResponse("Comment added successfully", { comment: newComment });
  }, {
    body: t.Object({
      comment: t.String({ minLength: 1 })
    })
  });
