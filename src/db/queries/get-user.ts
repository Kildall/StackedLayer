import { invitations, users, type User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db";

/**
 * Gets an user by email
 * @param email - The email of the user
 * @returns The user or null if the user does not exist
 */
export async function getUser(email: string): Promise<User | null> {
  const queryResult = await db.select().from(users).where(eq(users.email, email));
  if(queryResult.length === 0) return null;
  if(queryResult.length > 1) throw new Error("Multiple users found with the same email");
  return queryResult[0];
}

/**
 * Gets an user where the invitation is not null
 * @param email - The email of the user
 * @returns The user with the invitation or null if the user does not exist
 */
export async function getUserWithInvite(email: string): Promise<User | null> {
  const queryResult = await db.select().from(users).where(eq(users.email, email)).innerJoin(invitations, eq(invitations.token, users.invitation));
  if(queryResult.length === 0) return null;
  if(queryResult.length > 1) throw new Error("Multiple users found with the same email");
  return queryResult[0].user;
}

/** Get an user by id
 * @param id - The id of the user
 * @returns The user or null if the user does not exist
 */
export async function getUserById(id: string): Promise<User | null> {
  const queryResult = await db.select().from(users).where(eq(users.id, id));
  if(queryResult.length === 0) return null;
  if(queryResult.length > 1) throw new Error("Multiple users found with the same id");
  return queryResult[0];
}