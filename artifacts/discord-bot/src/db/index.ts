import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";

const { Pool } = pg;

if (!process.env.AIVEN_DATABASE_URL) {
  throw new Error("AIVEN_DATABASE_URL must be set");
}

const url = new URL(process.env.AIVEN_DATABASE_URL);
url.searchParams.delete("sslmode");

export const pool = new Pool({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(pool, { schema });

export * from "./schema.js";
