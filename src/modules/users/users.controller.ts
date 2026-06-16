import { Elysia, t } from "elysia";
import { usersService } from "./users.service";
import { requireAuth } from "../../middleware/auth";
import { requireRole } from "../../middleware/role";
import { createSuccessResponse, createErrorResponse, createPaginationResponse } from "../../shared/utils/response";
import { db } from "../../db";
import { users } from "../../db/schema";
import { eq, and, not } from "drizzle-orm";

const userSchema = {
  username: t.String({ minLength: 3 }),
  name: t.String({ minLength: 1 }),
  password: t.String({ minLength: 6 }),
  role: t.Union([t.Literal("SUPER_ADMIN"), t.Literal("DESIGNER"), t.Literal("VIEWER")]),
  isActive: t.Optional(t.Boolean()),
};

const updateUserSchema = {
  username: t.Optional(t.String({ minLength: 3 })),
  name: t.Optional(t.String({ minLength: 1 })),
  password: t.Optional(t.String({ minLength: 6 })),
  role: t.Optional(t.Union([t.Literal("SUPER_ADMIN"), t.Literal("DESIGNER"), t.Literal("VIEWER")])),
  isActive: t.Optional(t.Boolean()),
};

export const usersController = new Elysia({ prefix: "/api/v1/users" })
  .use(requireAuth)
  .get("/:id", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    if (user!.role !== "SUPER_ADMIN" && user!.id !== id) {
      set.status = 403;
      return createErrorResponse("Forbidden: Can only read own profile");
    }
    const targetUser = await usersService.getUserById(id);
    if (!targetUser) {
      set.status = 404;
      return createErrorResponse("User not found");
    }
    return createSuccessResponse("User retrieved successfully", { user: targetUser });
  })
  .use(requireRole(["SUPER_ADMIN"]))
  .get("/", async ({ query }) => {
    const page = query.page ? parseInt(query.page as string) : 1;
    const limit = query.limit ? parseInt(query.limit as string) : 10;
    const search = query.search as string | undefined;
    const role = query.role;
    let isActive = undefined;
    if (query.isActive !== undefined) {
      isActive = query.isActive === "true";
    }

    const { items, total } = await usersService.getUsers(page, limit, search, role, isActive);
    const totalPages = Math.ceil(total / limit);

    return createPaginationResponse("Data retrieved successfully", items, { page, limit, total, totalPages });
  })
  .post("/", async ({ body, set }) => {
    const { username } = body;
    const [existing] = await db.select().from(users).where(eq(users.username, username));
    if (existing) {
      set.status = 400;
      return createErrorResponse("Username already exists");
    }

    const newUser = await usersService.createUser(body);
    const { passwordHash, ...safeUser } = newUser;
    return createSuccessResponse("User created successfully", { user: safeUser });
  }, {
    body: t.Object(userSchema)
  })
  .patch("/:id", async ({ params: { id }, body, set }) => {
    if (body.username) {
      const [existing] = await db.select().from(users).where(and(eq(users.username, body.username), not(eq(users.id, id))));
      if (existing) {
        set.status = 400;
        return createErrorResponse("Username already exists");
      }
    }
    const updated = await usersService.updateUser(id, body);
    if (!updated) {
      set.status = 404;
      return createErrorResponse("User not found");
    }
    const { passwordHash, ...safeUser } = updated;
    return createSuccessResponse("User updated successfully", { user: safeUser });
  }, {
    body: t.Object(updateUserSchema)
  })
  .delete("/:id", async (ctx: any) => {
    const { params: { id }, user, set } = ctx;
    if (user!.id === id) {
      set.status = 400;
      return createErrorResponse("Cannot delete/deactivate self");
    }
    const updated = await usersService.deactivateUser(id);
    if (!updated) {
      set.status = 404;
      return createErrorResponse("User not found");
    }
    const { passwordHash, ...safeUser } = updated;
    return createSuccessResponse("User deactivated successfully", { user: safeUser });
  });
