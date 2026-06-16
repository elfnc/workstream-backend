import { Elysia, t } from "elysia";
import { attachmentsService } from "./attachments.service";
import { tasksService } from "../tasks/tasks.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";
import { randomUUID } from "crypto";
import * as path from "path";
import { mkdirSync, existsSync } from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

export const attachmentsController = new Elysia({ prefix: "/api/v1/tasks/:id/attachments" })
  .use(requireAuth)
  .use(requireRole(["SUPER_ADMIN", "DESIGNER"]))
  .post("/", async (ctx: any) => {
    const { params: { id }, body: { file }, user, set } = ctx;
    
    if (!file) {
      set.status = 400;
      return createErrorResponse("No file uploaded");
    }

    const task = await tasksService.getTaskById(id);
    if (!task) {
      set.status = 404;
      return createErrorResponse("Task not found");
    }
    if (user.role === "DESIGNER" && task.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot upload attachment to other designer's task");
    }

    // Validate size (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      set.status = 400;
      return createErrorResponse("File size exceeds 5MB limit");
    }

    // Validate type (jpg, jpeg, png, pdf)
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      set.status = 400;
      return createErrorResponse("Invalid file type. Allowed: jpg, jpeg, png, pdf");
    }

    const ext = path.extname(file.name);
    const uniqueFilename = `${Date.now()}-${randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, uniqueFilename);

    // Using Bun.write
    await Bun.write(filePath, file);

    const attachment = await attachmentsService.addAttachment({
      taskId: id,
      userId: user.id,
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: filePath
    });

    return createSuccessResponse("File uploaded successfully", { attachment });
  }, {
    body: t.Object({
      file: t.File()
    })
  });

export const attachmentsDeleteController = new Elysia({ prefix: "/api/v1/attachments" })
  .use(requireAuth)
  .use(requireRole(["SUPER_ADMIN", "DESIGNER"]))
  .delete("/:id", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    const attachment = await attachmentsService.getAttachmentById(id);
    if (!attachment) {
      set.status = 404;
      return createErrorResponse("Attachment not found");
    }
    
    const task = await tasksService.getTaskById(attachment.taskId);
    if (user.role === "DESIGNER" && task?.assignedToId !== user.id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Cannot delete attachment from other designer's task");
    }

    await attachmentsService.deleteAttachment(id, user.id);
    return createSuccessResponse("Attachment deleted successfully", null);
  });
