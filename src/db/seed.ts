import { logger } from "../config/logger";
import { db } from "./index";
import {
  users,
  categories,
  priorities,
  patternSizes,
  tasks,
} from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  logger.info("Starting database seed...");

  try {
    // 1. Seed Users
    const passwordHash = await bcrypt.hash("password123", 10);
    const seedUsers = await db.insert(users).values([
      { username: "admin", name: "Super Admin", role: "SUPER_ADMIN", passwordHash },
      { username: "designer1", name: "Designer 1", role: "DESIGNER", passwordHash },
      { username: "designer2", name: "Designer 2", role: "DESIGNER", passwordHash },
      { username: "viewer", name: "Viewer", role: "VIEWER", passwordHash },
    ]).returning();
    logger.info("Users seeded.");

    const designer1 = seedUsers.find((u) => u.username === "designer1")!;
    const designer2 = seedUsers.find((u) => u.username === "designer2")!;

    // 2. Seed Categories
    const seedCategories = await db.insert(categories).values([
      { name: "New Design" },
      { name: "Tracing" },
      { name: "Resize Pattern" },
      { name: "Color Adjustment" },
      { name: "Repeat Pattern" },
      { name: "Revision" },
      { name: "Other" },
    ]).returning();
    logger.info("Categories seeded.");

    const catResize = seedCategories.find((c) => c.name === "Resize Pattern")!;
    const catTracing = seedCategories.find((c) => c.name === "Tracing")!;
    const catColor = seedCategories.find((c) => c.name === "Color Adjustment")!;
    const catRepeat = seedCategories.find((c) => c.name === "Repeat Pattern")!;
    const catRevision = seedCategories.find((c) => c.name === "Revision")!;
    const catNewDesign = seedCategories.find((c) => c.name === "New Design")!;
    const catOther = seedCategories.find((c) => c.name === "Other")!;

    // 3. Seed Priorities
    const seedPriorities = await db.insert(priorities).values([
      { name: "Low", level: "LOW" },
      { name: "Medium", level: "MEDIUM" },
      { name: "High", level: "HIGH" },
      { name: "Urgent", level: "URGENT" },
    ]).returning();
    logger.info("Priorities seeded.");

    const prioLow = seedPriorities.find((p) => p.name === "Low")!;
    const prioMedium = seedPriorities.find((p) => p.name === "Medium")!;
    const prioHigh = seedPriorities.find((p) => p.name === "High")!;
    const prioUrgent = seedPriorities.find((p) => p.name === "Urgent")!;

    // 4. Seed Pattern Sizes
    const seedSizes = await db.insert(patternSizes).values([
      { size: 10 },
      { size: 12 },
      { size: 14 },
    ]).returning();
    logger.info("Pattern Sizes seeded.");

    const size10 = seedSizes.find((s) => s.size === 10)!;
    const size12 = seedSizes.find((s) => s.size === 12)!;
    const size14 = seedSizes.find((s) => s.size === 14)!;

    // 5. Seed Tasks
    await db.insert(tasks).values([
      {
        title: "Resize Pattern Ukuran 10",
        categoryId: catResize.id,
        priorityId: prioMedium.id,
        patternSizeId: size10.id,
        assignedToId: designer1.id,
        status: "QUEUE",
      },
      {
        title: "Resize Pattern Ukuran 12",
        categoryId: catResize.id,
        priorityId: prioMedium.id,
        patternSizeId: size12.id,
        assignedToId: designer2.id,
        status: "WORKING",
        progress: 25,
      },
      {
        title: "Resize Pattern Ukuran 14",
        categoryId: catResize.id,
        priorityId: prioLow.id,
        patternSizeId: size14.id,
        assignedToId: designer1.id,
        status: "QUEUE",
      },
      {
        title: "Tracing Artwork A-1245",
        categoryId: catTracing.id,
        priorityId: prioHigh.id,
        assignedToId: designer1.id,
        status: "CHECKING",
        progress: 85,
      },
      {
        title: "Color Adjustment Motif Floral",
        categoryId: catColor.id,
        priorityId: prioUrgent.id,
        assignedToId: designer2.id,
        status: "REVISION",
        progress: 60,
      },
      {
        title: "Repeat Pattern Check",
        categoryId: catRepeat.id,
        priorityId: prioMedium.id,
        assignedToId: designer2.id,
        status: "QUEUE",
      },
      {
        title: "Revisi Warna Navy",
        categoryId: catRevision.id,
        priorityId: prioHigh.id,
        assignedToId: designer1.id,
        status: "READY_UPLOAD",
        progress: 95,
      },
      {
        title: "Layout Motif Rotary",
        categoryId: catNewDesign.id,
        priorityId: prioMedium.id,
        assignedToId: designer2.id,
        status: "DONE",
        progress: 100,
        completedAt: new Date(),
      },
      {
        title: "Cleanup File Design",
        categoryId: catOther.id,
        priorityId: prioLow.id,
        assignedToId: designer1.id,
        status: "QUEUE",
      },
    ]);
    logger.info("Tasks seeded.");

    logger.info("Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
