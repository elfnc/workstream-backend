import { logger } from "../config/logger";

async function main() {
  logger.info("Starting database seed...");
  // TODO: Add seed logic here
  logger.info("Database seed completed!");
  process.exit(0);
}

main().catch((err) => {
  logger.error("Error seeding database:", err);
  process.exit(1);
});
