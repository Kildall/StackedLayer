import { defineConfig } from "drizzle-kit";

if (!process.env.AUTH_DRIZZLE_URL) {
  throw new Error('AUTH_DRIZZLE_URL is required');
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.AUTH_DRIZZLE_URL,
  },
});
