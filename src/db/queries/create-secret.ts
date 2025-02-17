
import { db } from "@/db";
import { accessLogs, secrets } from "@/db/schema";
import { FILE_EXPIRATION_SECONDS, LOGIN_REQUIRED, SECRET_EXPIRATION_SECONDS } from "astro:env/server";
import { getUser } from "./get-user";
import type { CreateSecretOptions, CreateSecretResult } from "@/types/db/queries/create-secret";


export async function createSecret(encryptedSecret: string, options: CreateSecretOptions): Promise<CreateSecretResult> {
  const { email, type, request } = options;
  let userId: string | undefined;
  
  if (LOGIN_REQUIRED) {
    if(!email) {
      throw new Error("Email is required");
    }
    const user = await getUser(email);
    if (!user) {
      throw new Error("User not found");
    }
    userId = user.id;
  }

  let expiresAt: Date;
  switch(type) {
    case "text":
      expiresAt = new Date(Date.now() + 1000 * SECRET_EXPIRATION_SECONDS);
      break;
    case "file":
      expiresAt = new Date(Date.now() + 1000 * FILE_EXPIRATION_SECONDS);
      break;
  }

  const result = await db.insert(secrets).values({
    encryptedData: encryptedSecret,
    expiresAt,
    userId,
    type,
  }).returning().then(result => result[0]);

  await db.insert(accessLogs).values({
    userId,
    secretId: result.id,
    ip: request.ip,
    userAgent: request.userAgent,
    type: 'UPLOAD',
  });

  return {
    id: result.id,
    expiresAt: result.expiresAt,
  };
}