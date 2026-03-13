import { execSync } from "node:child_process";

const containerName = process.env.DB_CONTAINER_NAME ?? "coinpulse-db-5433";
const image = process.env.DB_IMAGE ?? "postgres:16";
const port = process.env.DB_PORT ?? "5433";
const user = process.env.DB_USER ?? "postgres";
const password = process.env.DB_PASSWORD ?? "postgres";
const database = process.env.DB_NAME ?? "coinpulse";

function run(
  command: string,
  options?: { stdio?: "pipe" | "inherit"; env?: NodeJS.ProcessEnv },
) {
  return execSync(command, {
    stdio: options?.stdio ?? "inherit",
    env: options?.env ?? process.env,
  });
}

function getOutput(command: string) {
  return run(command, { stdio: "pipe" }).toString().trim();
}

function containerExists(name: string) {
  try {
    const out = getOutput(
      `docker ps -a --filter "name=^/${name}$" --format "{{.Names}}"`,
    );
    return out === name;
  } catch {
    return false;
  }
}

function containerRunning(name: string) {
  try {
    const out = getOutput(
      `docker ps --filter "name=^/${name}$" --format "{{.Names}}"`,
    );
    return out === name;
  } catch {
    return false;
  }
}

function ensureContainer() {
  if (!containerExists(containerName)) {
    console.log(`Creating container ${containerName} on port ${port}...`);
    run(
      [
        "docker run -d",
        `--name ${containerName}`,
        `-e POSTGRES_USER=${user}`,
        `-e POSTGRES_PASSWORD=${password}`,
        `-e POSTGRES_DB=${database}`,
        `-p ${port}:5432`,
        image,
      ].join(" "),
    );
    return;
  }

  if (!containerRunning(containerName)) {
    console.log(`Starting existing container ${containerName}...`);
    run(`docker start ${containerName}`);
  } else {
    console.log(`Container ${containerName} is already running.`);
  }
}

function waitForDbReady() {
  console.log("Waiting for PostgreSQL readiness...");
  const maxAttempts = 40;
  for (let i = 0; i < maxAttempts; i += 1) {
    try {
      run(`docker exec ${containerName} pg_isready -U ${user} -d ${database}`, {
        stdio: "pipe",
      });
      console.log("PostgreSQL is ready.");
      return;
    } catch {
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    }
  }
  throw new Error("PostgreSQL did not become ready in time");
}

function pushSchema() {
  const databaseUrl = `postgresql://${user}:${password}@localhost:${port}/${database}`;
  console.log("Applying Prisma schema with db push...");
  const prismaEnv = {
    ...process.env,
    DATABASE_URL: databaseUrl,
  };

  try {
    run("npx prisma db push", { env: prismaEnv });
  } catch {
    console.log(
      "Prisma db push requires reset for incompatible changes. Retrying with --force-reset...",
    );
    run("npx prisma db push --force-reset", { env: prismaEnv });
  }

  console.log(`Done. DATABASE_URL used: ${databaseUrl}`);
}

function main() {
  ensureContainer();
  waitForDbReady();
  pushSchema();
}

main();
