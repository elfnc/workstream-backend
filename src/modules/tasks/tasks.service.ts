import { db } from "../../db";
import { tasks, activityLogs, progressLogs } from "../../db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

export const tasksService = {
  async getTasks(params: any) {
    const { page, limit, status, designerId, categoryId, priorityId, patternSizeId, search, sortBy, sortOrder } = params;
    const offset = (page - 1) * limit;
    
    const conditionsArray: any[] = [];
    if (status) conditionsArray.push(eq(tasks.status, status));
    if (designerId) conditionsArray.push(eq(tasks.assignedToId, designerId));
    if (categoryId) conditionsArray.push(eq(tasks.categoryId, categoryId));
    if (priorityId) conditionsArray.push(eq(tasks.priorityId, priorityId));
    if (patternSizeId) conditionsArray.push(eq(tasks.patternSizeId, patternSizeId));
    if (search) {
      conditionsArray.push(or(ilike(tasks.title, `%${search}%`), ilike(tasks.referenceNumber, `%${search}%`)));
    }
    
    const conditions = conditionsArray.length > 0 ? and(...conditionsArray) : undefined;
    
    let orderBy: any = desc(tasks.createdAt);
    if (sortBy === "dueDate") {
      orderBy = sortOrder === "asc" ? asc(tasks.dueDate) : desc(tasks.dueDate);
    } else if (sortBy === "updatedAt") {
      orderBy = sortOrder === "asc" ? asc(tasks.updatedAt) : desc(tasks.updatedAt);
    }

    const [totalResult] = await db.select({ count: sql<number>`cast(count(${tasks.id}) as integer)` }).from(tasks).where(conditions);
    const total = totalResult.count;

    const items = await db.select().from(tasks).where(conditions).limit(limit).offset(offset).orderBy(orderBy);
    return { items, total };
  },

  async getBoard(designerId?: string) {
    const conditions = designerId ? eq(tasks.assignedToId, designerId) : undefined;
    const allTasks = await db.select().from(tasks).where(conditions).orderBy(desc(tasks.updatedAt));
    const grouped = allTasks.reduce((acc: any, task) => {
      if (!acc[task.status]) acc[task.status] = [];
      acc[task.status].push(task);
      return acc;
    }, {});
    return grouped;
  },

  async getTaskById(id: string) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || null;
  },

  async createTask(data: any, userId: string) {
    return await db.transaction(async (tx) => {
      // Due date might need parsing if passed as string
      const insertData = { ...data };
      if (insertData.dueDate) insertData.dueDate = new Date(insertData.dueDate);
      
      const [newTask] = await tx.insert(tasks).values(insertData).returning();
      await tx.insert(activityLogs).values({
        userId,
        taskId: newTask.id,
        action: "CREATE",
        newValue: JSON.stringify(newTask)
      });
      return newTask;
    });
  },

  async updateTask(id: string, data: any, userId: string) {
    const updateData = { ...data, updatedAt: new Date() };
    if (updateData.dueDate) updateData.dueDate = new Date(updateData.dueDate);

    return await db.transaction(async (tx) => {
      const [oldTask] = await tx.select().from(tasks).where(eq(tasks.id, id));
      if (!oldTask) return null;
      
      const [updatedTask] = await tx.update(tasks).set(updateData).where(eq(tasks.id, id)).returning();
      await tx.insert(activityLogs).values({
        userId,
        taskId: id,
        action: "UPDATE",
        oldValue: JSON.stringify(oldTask),
        newValue: JSON.stringify(updatedTask)
      });
      return updatedTask;
    });
  },

  async deleteTask(id: string, userId: string) {
    return await db.transaction(async (tx) => {
      const [oldTask] = await tx.select().from(tasks).where(eq(tasks.id, id));
      if (!oldTask) return null;

      await tx.delete(activityLogs).where(eq(activityLogs.taskId, id));
      await tx.delete(progressLogs).where(eq(progressLogs.taskId, id));
      await tx.delete(tasks).where(eq(tasks.id, id));
      
      await tx.insert(activityLogs).values({
        userId,
        action: "DELETE",
        oldValue: JSON.stringify(oldTask)
      });
      return oldTask;
    });
  },

  async updateStatus(id: string, status: any, userId: string) {
    return await db.transaction(async (tx) => {
      const [oldTask] = await tx.select().from(tasks).where(eq(tasks.id, id));
      if (!oldTask) return null;

      const completedAt = status === "DONE" ? new Date() : null;
      const [updatedTask] = await tx.update(tasks).set({ 
        status, 
        completedAt, 
        updatedAt: new Date() 
      }).where(eq(tasks.id, id)).returning();

      await tx.insert(activityLogs).values({
        userId,
        taskId: id,
        action: "STATUS_CHANGE",
        oldValue: oldTask.status,
        newValue: status
      });
      return updatedTask;
    });
  },

  async updateProgress(id: string, progress: number, note: string, userId: string) {
    return await db.transaction(async (tx) => {
      const [oldTask] = await tx.select().from(tasks).where(eq(tasks.id, id));
      if (!oldTask) return null;

      const [updatedTask] = await tx.update(tasks).set({ 
        progress, 
        progressNote: note,
        updatedAt: new Date() 
      }).where(eq(tasks.id, id)).returning();

      await tx.insert(progressLogs).values({
        taskId: id,
        userId,
        progress,
        note
      });

      await tx.insert(activityLogs).values({
        userId,
        taskId: id,
        action: "PROGRESS_UPDATE",
        oldValue: oldTask.progress.toString(),
        newValue: progress.toString()
      });

      return updatedTask;
    });
  }
};
