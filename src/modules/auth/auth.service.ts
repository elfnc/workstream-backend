import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authService = {
  async validateLogin(username: string, passwordString: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(passwordString, user.passwordHash);
    if (!isValid) {
      return null;
    }
    return user;
  }
};
