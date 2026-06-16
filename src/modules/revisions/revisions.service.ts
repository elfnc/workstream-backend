import { db } from "../../db";
import { revisionNotes, activityLogs, notifications, tasks } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const revisionsService = {
  async getRevisions(taskId: string) {
    return db.select().from(revisionNotes).where(eq(revisionNotes.taskId, taskId)).orderBy(desc(revisionNotes.createdAt));
  },
  async addRevision(taskId: string, userId: string, note: string) {
    return await db.transaction(async (tx) => {
      const [newRevision] = await tx.insert(revisionNotes).values({
        taskId,
        userId,
        note
      }).returning();

      await tx.insert(activityLogs).values({
        taskId,
        userId,
        action: "UPDATE",
        newValue: "Added revision note"
      });

      const [task] = await tx.select().from(tasks).where(eq(tasks.id, taskId));
      if (task?.assignedToId) {
        await tx.insert(notifications).values({
          userId: task.assignedToId,
          type: "REVISION_ADDED",
          message: "A new revision note has been added to your task",
          taskId
        });
      }

      return newRevision;
    });
  }
};
