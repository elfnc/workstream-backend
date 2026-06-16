import { db } from "../../db";
import { attachments, activityLogs } from "../../db/schema";
import { eq } from "drizzle-orm";
import { unlink } from "fs/promises";

export const attachmentsService = {
  async addAttachment(data: { taskId: string, userId: string, filename: string, originalName: string, mimeType: string, size: number, path: string }) {
    return await db.transaction(async (tx) => {
      const [newAttachment] = await tx.insert(attachments).values(data).returning();
      
      await tx.insert(activityLogs).values({
        taskId: data.taskId,
        userId: data.userId,
        action: "UPDATE",
        newValue: `Uploaded file: ${data.originalName}`
      });

      return newAttachment;
    });
  },
  async getAttachmentById(id: string) {
    const [attachment] = await db.select().from(attachments).where(eq(attachments.id, id));
    return attachment || null;
  },
  async deleteAttachment(id: string, userId: string) {
    return await db.transaction(async (tx) => {
      const [attachment] = await tx.select().from(attachments).where(eq(attachments.id, id));
      if (!attachment) return null;

      await tx.delete(attachments).where(eq(attachments.id, id));

      await tx.insert(activityLogs).values({
        taskId: attachment.taskId,
        userId,
        action: "UPDATE",
        oldValue: `Deleted file: ${attachment.originalName}`
      });

      try {
        await unlink(attachment.path);
      } catch (e) {
        // ignore if file already missing
      }

      return attachment;
    });
  }
};
