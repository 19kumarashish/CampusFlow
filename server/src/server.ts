import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";
import { seedRoles } from "./config/seed";
import { logger } from "./utils/logger";

const startServer = async () => {
  // Connect to MongoDB
  await connectDatabase();

  // Seed default roles
  await seedRoles();

  // Start the server
  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on port ${env.PORT}`);
  });
};

startServer();