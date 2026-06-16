import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["SUPER_ADMIN", "DESIGNER", "VIEWER"]);
export const taskStatusEnum = pgEnum("task_status", [
  "QUEUE",
  "WORKING",
  "CHECKING",
  "REVISION",
  "READY_UPLOAD",
  "DONE",
]);
export const priorityLevelEnum = pgEnum("priority_level", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);
