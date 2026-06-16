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
  }
};
