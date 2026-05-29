import { defineConfig } from "drizzle-kit";

if (!process.env.AIVEN_DATABASE_URL) {
  throw new Error("AIVEN_DATABASE_URL must be set");
}

const url = new URL(process.env.AIVEN_DATABASE_URL);
url.searchParams.set("sslmode", "require");
url.searchParams.set("uselibpqcompat", "true");

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: url.toString(),
  },
});
