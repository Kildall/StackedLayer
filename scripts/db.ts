import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.AUTH_DRIZZLE_URL;
if (!connectionString) {
  throw new Error('AUTH_DRIZZLE_URL is not set');
}

const client = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false,
    // Add these explicit SSL parameters
    sslmode: 'require',
    ssl: true
  },
  max: 10, // connection pool size
  connect_timeout: 60000,
  idle_timeout: 30,
  max_lifetime: 60 * 30,
  debug: true,
});

export const db = drizzle(client);