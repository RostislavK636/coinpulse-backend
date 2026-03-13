import "dotenv/config";
import { createApp } from "./app/bootstrap/createApp";
import { prisma } from "./prisma/client";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully");
  } catch (error) {
    console.error("Failed to connect to database on startup", error);
    process.exit(1);
  }

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`CoinPulse backend started on port ${PORT}`);
  });

  let shuttingDown = false;

  const shutdown = async (signal: "SIGINT" | "SIGTERM") => {
    if (shuttingDown) {
      return;
    }
    shuttingDown = true;
    console.log(`Received ${signal}, shutting down gracefully...`);

    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });

    await prisma.$disconnect();
    console.log("Shutdown complete");
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });
  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

void startServer();
