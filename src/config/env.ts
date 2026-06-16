import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("7d"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  COOKIE_NAME: z.string().default("workstream_token"),
  COOKIE_SECURE: z.string().default("false").transform((val) => val === "true"),
  COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  UPLOAD_DIR: z.string().default("uploads"),
  MAX_FILE_SIZE: z.string().default("5242880").transform((val) => parseInt(val, 10)),
});

export const env = envSchema.parse(process.env);
