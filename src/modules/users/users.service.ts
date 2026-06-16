import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, ilike, or, and, sql } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const usersService = {
  async getUsers(page: number, limit: number, search?: string, role?: any, isActive?: boolean) {
    const offset = (page - 1) * limit;
    
    let conditions = undefined;
    const conditionsArray: any[] = [];
    
    if (search) {
      conditionsArray.push(or(ilike(users.username, `%${search}%`), ilike(users.name, `%${search}%`)));
    }
    if (role) {
      conditionsArray.push(eq(users.role, role));
    }
    if (isActive !== undefined) {
      conditionsArray.push(eq(users.isActive, isActive));
    }
    if (conditionsArray.length > 0) {
      conditions = and(...conditionsArray);
    }

    const [totalResult] = await db.select({ count: sql<number>`cast(count(${users.id}) as integer)` }).from(users).where(conditions);
    const total = totalResult.count;

    const items = await db.select({
      id: users.id,
      username: users.username,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users)
      .where(conditions)
      .limit(limit)
      .offset(offset);

    return { items, total };
  },

  async getUserById(id: string) {
    const [user] = await db.select({
      id: users.id,
      username: users.username,
      name: users.name,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users).where(eq(users.id, id));
    return user || null;
  },

  async createUser(data: any) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const [newUser] = await db.insert(users).values({
      username: data.username,
      name: data.name,
      role: data.role,
      passwordHash,
      isActive: data.isActive,
    }).returning();
    return newUser;
  },

  async updateUser(id: string, data: any) {
    const updateData: any = { ...data, updatedAt: new Date() };
    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
      delete updateData.password;
    }
    const [updated] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return updated;
  },

  async deactivateUser(id: string) {
    const [updated] = await db.update(users).set({ isActive: false, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return updated;
  }
};
