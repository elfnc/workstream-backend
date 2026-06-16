import { db } from "../../db";
import { notifications } from "../../db/schema";
import { eq, desc } from "drizzle-orm";

export const notificationsService = {
  async getNotifications(userId: string) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  },
  async markAsRead(id: string, userId: string) {
    return await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
  },
  async markAllAsRead(userId: string) {
    return await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId)).returning();
  }
};
