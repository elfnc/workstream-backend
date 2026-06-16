import { db } from "../../db";
import { tasks, users } from "../../db/schema";
import { eq, sql } from "drizzle-orm";

export const workloadService = {
  async getWorkload(designerId?: string) {
    let query = db.select({
      designerId: users.id,
      designerName: users.name,
      activeTasks: sql<number>`cast(count(${tasks.id}) filter (where ${tasks.status} != 'DONE') as integer)`,
      workingTasks: sql<number>`cast(count(${tasks.id}) filter (where ${tasks.status} = 'WORKING') as integer)`,
      revisionTasks: sql<number>`cast(count(${tasks.id}) filter (where ${tasks.status} = 'REVISION') as integer)`,
      overdueTasks: sql<number>`cast(count(${tasks.id}) filter (where ${tasks.dueDate} < current_date and ${tasks.status} != 'DONE') as integer)`,
      avgProgress: sql<number>`cast(coalesce(avg(${tasks.progress}) filter (where ${tasks.status} != 'DONE'), 0) as integer)`
    })
    .from(users)
    .leftJoin(tasks, eq(users.id, tasks.assignedToId))
    .where(eq(users.role, 'DESIGNER'))
    .groupBy(users.id);

    const result = await query;
    if (designerId) {
      return result.filter(r => r.designerId === designerId);
    }
    return result;
  },
  async getWorkloadDetail(designerId: string) {
    const designerTasks = await db.select().from(tasks).where(eq(tasks.assignedToId, designerId));
    const grouped = designerTasks.reduce((acc: any, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {});
    return grouped;
  }
};
