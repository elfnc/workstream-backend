import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.PORT, () => {
  logger.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
});
