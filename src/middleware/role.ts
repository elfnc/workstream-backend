import { Elysia } from "elysia";
import { requireAuth } from "./auth";
import { createErrorResponse } from "../shared/utils/response";

export const requireRole = (allowedRoles: string[]) => (app: Elysia) =>
  app
    .use(requireAuth)
    .onBeforeHandle((ctx: any) => {
      const { user, set } = ctx;
      if (!user) {
        set.status = 401;
        return createErrorResponse("Unauthorized");
      }

      if (user.role === "SUPER_ADMIN") {
        return; // Super admin always has access
      }

      if (!allowedRoles.includes(user.role)) {
        set.status = 403;
        return createErrorResponse("Forbidden: Insufficient role");
      }
    });
