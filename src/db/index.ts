import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {DATABASE_URL} from 'astro:env/server';

const connectionString = DATABASE_URL;
const client = postgres(connectionString, {
  prepare: false
});
export const db = drizzle(client);
