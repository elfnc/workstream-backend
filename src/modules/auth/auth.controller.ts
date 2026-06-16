import { Elysia, t } from "elysia";
import { authService } from "./auth.service";
import { authPlugin, requireAuth } from "../../middleware/auth";
import { createSuccessResponse, createErrorResponse } from "../../shared/utils/response";
import { env } from "../../config/env";

export const authController = new Elysia({ prefix: "/api/v1/auth" })
  .use(authPlugin)
  .post("/login", async ({ body, jwt, cookie: { workstream_token }, set }) => {
    const { username, password } = body;
    const user = await authService.validateLogin(username, password);
    
    if (!user) {
      set.status = 401;
      return createErrorResponse("Invalid credential");
    }

    if (!user.isActive) {
      set.status = 403;
      return createErrorResponse("User is inactive");
    }

    const token = await jwt.sign({ id: user.id });
    
    workstream_token.set({
      value: token,
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: env.COOKIE_SAME_SITE,
      path: "/",
    });
    console.log("Login successful, setting cookie:", workstream_token.value);

    const { passwordHash, ...safeUser } = user;

    return createSuccessResponse("Login successful", { user: safeUser });
  }, {
    body: t.Object({
      username: t.String({ minLength: 1, error: "Username is required" }),
      password: t.String({ minLength: 1, error: "Password is required" }),
    }),
  })
  .post("/logout", async ({ cookie: { workstream_token } }) => {
    workstream_token.remove();
    return createSuccessResponse("Logout successful");
  })
  .use(requireAuth)
  .get("/me", (ctx: any) => {
    const { user } = ctx;
    const { passwordHash, ...safeUser } = user!;
    return createSuccessResponse("User profile", { user: safeUser });
  });
