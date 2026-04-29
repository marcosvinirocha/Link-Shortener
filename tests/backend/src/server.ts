import "dotenv/config";
import app from "./app";
import Environment from "./config/env";
import Database from "./config/database";
import RedisClient from "./config/redis";

async function bootstrap() {
  try {
    Environment.load();

    console.log("Starting Link Shortener Backend...");
    console.log(`Environment: ${Environment.get("NODE_ENV")}`);
    console.log(`Base URL: ${Environment.get("BASE_URL")}`);

    await Database.connect();
    await RedisClient.connect();

    const PORT = parseInt(Environment.get("PORT"), 10);
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API: ${Environment.get("BASE_URL")}/api`);
      console.log(`Health: ${Environment.get("BASE_URL")}/api/health`);
    });

    const shutdown = async () => {
      console.log("Shutting down gracefully...");

      server.close(async () => {
        console.log("HTTP server closed");

        await Database.disconnect();
        await RedisClient.disconnect();

        console.log("Goodbye!");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

bootstrap();
