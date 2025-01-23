import * as schema from "./schema";
import { reset } from "drizzle-seed";
import { db } from "./index";

async function main() {
  console.log('⚠️ Resetting database');
  await reset(db, schema);
  console.log('✅ Database reset');
}
main();