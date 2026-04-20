import { PrismaClient } from "@prisma/client";

// Lazy singleton — Prisma client bound to SQLite in dev and the .exe bundle,
// and to Postgres in prod when DATABASE_URL starts with postgres://
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});
