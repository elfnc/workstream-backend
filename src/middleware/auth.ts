import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { env } from "../config/env";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { createErrorResponse } from "../shared/utils/response";

export const authPlugin = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
      exp: env.JWT_EXPIRES_IN,
    })
  )
  .derive(async ({ jwt, cookie: { workstream_token } }) => {
    if (!workstream_token || !workstream_token.value) {
      return { user: null };
    }

    const token = workstream_token.value as string;
    const payload = await jwt.verify(token);
    if (!payload || !payload.id) {
      return { user: null };
    }

    const [user] = await db.select().from(users).where(eq(users.id, payload.id as string));
    if (!user || !user.isActive) {
      return { user: null };
    }

    return { user };
  });

export const requireAuth = (app: Elysia) =>
  app
    .use(authPlugin)
    .onBeforeHandle((ctx: any) => {
      const { user, set } = ctx;
      if (!user) {
        set.status = 401;
        return createErrorResponse("Unauthorized or inactive user");
      }
    });
