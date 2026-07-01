import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { seedRoles } from "./config/seed";
import { seedAdminUser } from "./config/seed-admin";
import { logger } from "./utils/logger";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await seedRoles();
    await seedAdminUser();

    app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on port ${env.PORT}`);
    });
  } catch (error) {
    logger.error(
      `Failed to start server: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
};

void startServer();