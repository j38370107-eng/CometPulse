import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_URL.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
  },
});
