import { db } from "../../db";
import { taskComments, activityLogs } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const commentsService = {
  async getComments(taskId: string) {
    return db.select().from(taskComments).where(eq(taskComments.taskId, taskId)).orderBy(desc(taskComments.createdAt));
  },
  async addComment(taskId: string, userId: string, comment: string) {
    return await db.transaction(async (tx) => {
      const [newComment] = await tx.insert(taskComments).values({
        taskId,
        userId,
        comment
      }).returning();

      await tx.insert(activityLogs).values({
        taskId,
        userId,
        action: "UPDATE",
        newValue: "Added comment"
      });

      return newComment;
    });
  }
};
