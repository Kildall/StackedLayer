
import { invitations, type Invitation } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function getInvite(inviteCode: string): Promise<Invitation | null> {
  const queryResult = await db.select().from(invitations).where(eq(invitations.token, inviteCode));
  if(queryResult.length === 0) return null;
  if(queryResult.length > 1) throw new Error("Multiple invites found with the same invite code");
  return queryResult[0];
}