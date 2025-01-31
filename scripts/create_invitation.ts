import { generateInviteCode } from "../src/lib/invite-code.ts";
import { db } from "./db.ts";
import { invitations } from "../src/db/schema";

async function createInvitation(email: string) {
  const inviteData: typeof invitations.$inferInsert = {
    email,
    token: generateInviteCode("PREM", 1),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  };
  const invite = await db.insert(invitations).values(inviteData).returning();

  return invite;
}

export { createInvitation };

console.log(await createInvitation(process.argv[2]));
