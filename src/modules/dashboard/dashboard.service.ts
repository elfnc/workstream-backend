import { db } from "../../db";
import { tasks } from "../../db/schema";
import { eq } from "drizzle-orm";

export const dashboardService = {
  async getSummary(designerId?: string) {
    const condition = designerId ? eq(tasks.assignedToId, designerId) : undefined;
    const allTasks = await db.select().from(tasks).where(condition);
    
    const totalTasks = allTasks.length;
    const workingCount = allTasks.filter(t => t.status === 'WORKING').length;
    const revisionCount = allTasks.filter(t => t.status === 'REVISION').length;
    const readyUploadCount = allTasks.filter(t => t.status === 'READY_UPLOAD').length;
    
    const now = new Date();
    now.setHours(0,0,0,0);
    
    const overdueCount = allTasks.filter(t => {
      if (!t.dueDate || t.status === 'DONE') return false;
      const due = new Date(t.dueDate);
      due.setHours(0,0,0,0);
      return due < now;
    }).length;
    
    const dueTodayCount = allTasks.filter(t => {
      if (!t.dueDate || t.status === 'DONE') return false;
      const due = new Date(t.dueDate);
      due.setHours(0,0,0,0);
      return due.getTime() === now.getTime();
    }).length;

    return {
       totalTasks,
       workingCount,
       revisionCount,
       readyUploadCount,
       overdueCount,
       dueTodayCount
    };
  }
};
