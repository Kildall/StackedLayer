import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { AUTH_DRIZZLE_URL } from 'astro:env/server';

const connectionString = AUTH_DRIZZLE_URL;
const client = postgres(connectionString, {
  prepare: false
});
export const db = drizzle(client);
