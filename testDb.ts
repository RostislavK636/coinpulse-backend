import { prisma } from "./src/infrastructure/prisma/client";

async function run() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  console.log("Users:", users);
}

run()
  .catch((error) => {
    console.error("Failed to fetch users", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
