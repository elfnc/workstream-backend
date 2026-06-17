import { pgTable, text, varchar, timestamp, boolean, integer, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { roleEnum, taskStatusEnum, priorityLevelEnum, activityActionEnum, notificationTypeEnum } from "./enums";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").default("VIEWER").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  avatarUrl: text("avatar_url").default(sql`'https://avatars.githubusercontent.com/u/' || floor(random() * 9000000 + 1000000)::text`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const priorities = pgTable("priorities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  level: priorityLevelEnum("level").default("LOW").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const patternSizes = pgTable("pattern_sizes", {
  id: uuid("id").primaryKey().defaultRandom(),
  size: integer("size").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  referenceNumber: varchar("reference_number", { length: 255 }),
  description: text("description"),
  fileReference: varchar("file_reference", { length: 255 }),
  categoryId: uuid("category_id").references(() => categories.id),
  priorityId: uuid("priority_id").references(() => priorities.id),
  patternSizeId: uuid("pattern_size_id").references(() => patternSizes.id),
  assignedToId: uuid("assigned_to_id").references(() => users.id),
  createdById: uuid("created_by_id").references(() => users.id),
  status: taskStatusEnum("status").default("QUEUE").notNull(),
  progress: integer("progress").default(0).notNull(),
  progressNote: text("progress_note"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const taskComments = pgTable("task_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const revisionNotes = pgTable("revision_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const progressLogs = pgTable("progress_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  progress: integer("progress").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const activityLogs = pgTable("activity_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  taskId: uuid("task_id").references(() => tasks.id),
  action: activityActionEnum("action").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  message: text("message").notNull(),
  taskId: uuid("task_id").references(() => tasks.id),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id").references(() => tasks.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 255 }).notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  assignedTasks: many(tasks, { relationName: "assignedTasks" }),
  createdTasks: many(tasks, { relationName: "createdTasks" }),
  comments: many(taskComments),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  assignee: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [tasks.categoryId],
    references: [categories.id],
  }),
  priority: one(priorities, {
    fields: [tasks.priorityId],
    references: [priorities.id],
  }),
  patternSize: one(patternSizes, {
    fields: [tasks.patternSizeId],
    references: [patternSizes.id],
  }),
  assignedTo: one(users, {
    fields: [tasks.assignedToId],
    references: [users.id],
    relationName: "assignedTasks",
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "createdTasks",
  }),
  comments: many(taskComments),
  revisions: many(revisionNotes),
  progressLogs: many(progressLogs),
  attachments: many(attachments),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, { fields: [taskComments.taskId], references: [tasks.id] }),
  user: one(users, { fields: [taskComments.userId], references: [users.id] }),
}));

export const revisionNotesRelations = relations(revisionNotes, ({ one }) => ({
  task: one(tasks, { fields: [revisionNotes.taskId], references: [tasks.id] }),
  user: one(users, { fields: [revisionNotes.userId], references: [users.id] }),
}));

export const progressLogsRelations = relations(progressLogs, ({ one }) => ({
  task: one(tasks, { fields: [progressLogs.taskId], references: [tasks.id] }),
  user: one(users, { fields: [progressLogs.userId], references: [users.id] }),
}));

export const attachmentsRelations = relations(attachments, ({ one }) => ({
  task: one(tasks, { fields: [attachments.taskId], references: [tasks.id] }),
  user: one(users, { fields: [attachments.userId], references: [users.id] }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(users, { fields: [activityLogs.userId], references: [users.id] }),
  task: one(tasks, { fields: [activityLogs.taskId], references: [tasks.id] }),
}));
