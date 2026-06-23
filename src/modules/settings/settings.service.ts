import { db } from "../../db";
import { categories, priorities, patternSizes } from "../../db/schema";
import { eq } from "drizzle-orm";

export const settingsService = {
  async getCategories() {
    return db.select().from(categories).where(eq(categories.isActive, true));
  },
  async getPriorities() {
    return db.select().from(priorities).where(eq(priorities.isActive, true));
  },
  async getPatternSizes() {
    return db.select().from(patternSizes).where(eq(patternSizes.isActive, true));
  },

  // Categories CRUD
  async createCategory(data: { name: string }) {
    const [result] = await db.insert(categories).values(data).returning();
    return result;
  },
  async updateCategory(id: string, data: Partial<{ name: string; isActive: boolean }>) {
    const [result] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return result;
  },
  async deleteCategory(id: string) {
    const [result] = await db.update(categories).set({ isActive: false }).where(eq(categories.id, id)).returning();
    return result;
  },

  // Priorities CRUD
  async createPriority(data: { name: string; level: any }) {
    const [result] = await db.insert(priorities).values(data).returning();
    return result;
  },
  async updatePriority(id: string, data: Partial<{ name: string; level: any; isActive: boolean }>) {
    const [result] = await db.update(priorities).set(data).where(eq(priorities.id, id)).returning();
    return result;
  },
  async deletePriority(id: string) {
    const [result] = await db.update(priorities).set({ isActive: false }).where(eq(priorities.id, id)).returning();
    return result;
  },

  // Pattern Sizes CRUD
  async createPatternSize(data: { size: number }) {
    const [result] = await db.insert(patternSizes).values(data).returning();
    return result;
  },
  async updatePatternSize(id: string, data: Partial<{ size: number; isActive: boolean }>) {
    const [result] = await db.update(patternSizes).set(data).where(eq(patternSizes.id, id)).returning();
    return result;
  },
  async deletePatternSize(id: string) {
    const [result] = await db.update(patternSizes).set({ isActive: false }).where(eq(patternSizes.id, id)).returning();
    return result;
  }
};
