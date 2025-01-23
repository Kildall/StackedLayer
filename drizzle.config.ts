import { defineConfig } from "drizzle-kit";

if (!process.env.AUTH_DRIZZLE_URL) {
  throw new Error("AUTH_DRIZZLE_URL is required");
}

const AUTH_DRIZZLE_URL = process.env.AUTH_DRIZZLE_URL;

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./drizzle",

  dbCredentials: {
    url: AUTH_DRIZZLE_URL,
  },
});
