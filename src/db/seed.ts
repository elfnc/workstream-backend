import { logger } from "../config/logger";
import { db } from "./index";
import {
  users,
  categories,
  priorities,
  patternSizes,
} from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  logger.info("Starting database seed...");

  try {
    // 1. Seed Users (Hanya Admin)
    const passwordHash = await bcrypt.hash("password123", 10);
    await db.insert(users).values([
      { username: "admin", name: "Super Admin", role: "SUPER_ADMIN", passwordHash },
    ]);
    logger.info("Admin user seeded.");

    // 2. Seed Categories
    await db.insert(categories).values([
      { name: "New Design" },
      { name: "Tracing" },
      { name: "Resize Pattern" },
      { name: "Color Adjustment" },
      { name: "Repeat Pattern" },
      { name: "Revision" },
      { name: "Other" },
    ]);
    logger.info("Categories seeded.");

    // 3. Seed Priorities
    await db.insert(priorities).values([
      { name: "Low", level: "LOW" },
      { name: "Medium", level: "MEDIUM" },
      { name: "High", level: "HIGH" },
      { name: "Urgent", level: "URGENT" },
    ]);
    logger.info("Priorities seeded.");

    // 4. Seed Pattern Sizes
    await db.insert(patternSizes).values([
      { size: 10 },
      { size: 12 },
      { size: 14 },
    ]);
    logger.info("Pattern Sizes seeded.");

    logger.info("Database seed completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error("Error seeding database:", error);
    process.exit(1);
  }
}

main();
