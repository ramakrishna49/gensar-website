import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
      "Get a free Neon Postgres database at https://neon.tech"
  );
}

const pool = new Pool({
  connectionString: databaseUrl,
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});
export const db = drizzle(pool, { schema });
