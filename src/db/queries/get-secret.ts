import { db } from "@/db";
import { accessLogs, secrets, users } from "@/db/schema";
import type { GetSecretOptions, GetSecretResult } from "@/types/db/queries/get-secret";
import { arrayBufferToBase64 } from "@/utils/buffer-to-base64";
import { ENFORCE_ONE_TIME } from "astro:env/server";
import { eq } from "drizzle-orm";

export async function getSecret(secretId: string, options: GetSecretOptions): Promise<GetSecretResult> {
  const { userId, request } = options;

  // Get the secret from the database
  const dbSecret = await db
    .select()
    .from(secrets)
    .where(eq(secrets.id, secretId))
    .limit(1)
    .then(result => result[0]);

  if (!dbSecret) {
    throw new Error("Secret not found");
  }

  // Check if secret has expired
  if (dbSecret.expiresAt < new Date()) {
    await db.delete(secrets).where(eq(secrets.id, secretId));
    throw new Error("Secret has expired");
  }

  try {
    if (userId) {
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1).then(result => result[0]);
      if (!user) {
        throw new Error("User not found");
      }

      await db.insert(accessLogs).values({
        userId: user.id,
        secretId: dbSecret.id,
        ip: request.ip,
        userAgent: request.userAgent,
        type: 'VIEW',
      });
    }

    if (ENFORCE_ONE_TIME) {
      // Delete the secret after successful retrieval
      await db.delete(secrets).where(eq(secrets.id, secretId));
    }
    return {
      type: dbSecret.type as 'text' | 'file',
      content: dbSecret.encryptedData,
      expiresAt: dbSecret.expiresAt,
    };
  } catch (error) {
    throw error;
  }
}