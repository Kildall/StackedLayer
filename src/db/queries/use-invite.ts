
import { db } from "@/db";
import { invitations, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getInvite } from "./get-invite";
import { getUserById } from "./get-user";

export async function useInvite(inviteCode: string, userId: string) {
  const invite = await getInvite(inviteCode);
  const user = await getUserById(userId);
  if(!invite || invite.used) return false;
  if (!user) return false;
  if (user.invitation) return false;
  if (user.email !== invite.email) return false;
  await db.update(invitations).set({
    used: true,
    updatedAt: new Date(),
  }).where(eq(invitations.token, inviteCode));
  await db.update(users).set({
    invitation: invite.token,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
  return true;
}
