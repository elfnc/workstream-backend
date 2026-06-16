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
export const activityActionEnum = pgEnum("activity_action", [
  "CREATE",
  "UPDATE",
  "DELETE",
  "STATUS_CHANGE",
  "PROGRESS_UPDATE",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "TASK_ASSIGNED",
  "STATUS_CHANGED",
  "REVISION_ADDED",
]);
