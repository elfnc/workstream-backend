import { db } from "../../db";
import { activityLogs } from "../../db/schema";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export const activityService = {
  async getActivities(params: any) {
    const { page, limit, userId, taskId, action, startDate, endDate } = params;
    const offset = (page - 1) * limit;
    
    const conditionsArray: any[] = [];
    if (userId) conditionsArray.push(eq(activityLogs.userId, userId));
    if (taskId) conditionsArray.push(eq(activityLogs.taskId, taskId));
    if (action) conditionsArray.push(eq(activityLogs.action, action));
    
    if (startDate) {
      conditionsArray.push(gte(activityLogs.createdAt, new Date(startDate)));
    }
    if (endDate) {
      conditionsArray.push(lte(activityLogs.createdAt, new Date(endDate)));
    }

    const conditions = conditionsArray.length > 0 ? and(...conditionsArray) : undefined;
    
    const [totalResult] = await db.select({ count: sql<number>`cast(count(${activityLogs.id}) as integer)` }).from(activityLogs).where(conditions);
    const total = totalResult.count;

    const items = await db.select().from(activityLogs).where(conditions).limit(limit).offset(offset).orderBy(desc(activityLogs.createdAt));
    return { items, total };
  }
};
