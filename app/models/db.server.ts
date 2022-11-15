import invariant from "tiny-invariant";
import { PrismaClient } from '@prisma/client'

export type User = { id: string; email: string };

invariant(
  process.env.DATABASE_URL,
  "DATABASE_URL must be set in your environment variables."
);

let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  prisma = global.__db;
}

export { prisma };