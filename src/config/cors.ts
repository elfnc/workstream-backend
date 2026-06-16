import { cors } from "@elysiajs/cors";
import { env } from "./env";

export const corsPlugin = cors({
  origin: env.FRONTEND_URL,
  credentials: true,
});
