import "dotenv/config";
import { env } from "../schemas/env.schema.js";
import app from "./app.js";
import { prisma } from "../database/prisma.js";
import { redis } from "../database/redis.js";

const PORT = env.PORT ?? 3000;

const server = app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

let isShuttingDown = false;

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    console.log(`Received ${signal} again, forcefully shutting down...`);
    process.exit(1);
  }
  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down gracefully...`);

  // If closing takes more than 10 seconds we exit anyway, before Docker's
  // grace period runs out and turns this into a SIGKILL.
  const forceExit = setTimeout(() => {
    console.error("Forced shutdown by timeout");
    process.exit(1);
  }, 10_000);
  forceExit.unref();

  // Stop accepting new connections and let in-flight requests finish, then
  // close the resources those requests may still be using.
  server.close(async () => {
    try {
      await prisma.$disconnect();
      await redis.quit();
      console.log("Server closed gracefully.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
