import { db } from "@/db";
import { accessLogs, secrets, users } from "@/db/schema";
import { arrayBufferToBase64 } from "@/utils/buffer-to-base64";
import { decrypt, deriveKey, stringToKey } from "@/utils/encrypt";
import { ENFORCE_ONE_TIME, SECRET_KEY } from "astro:env/server";
import { eq } from "drizzle-orm";

interface GetSecretResult {
  type: 'text' | 'file';
  content?: string;
  fileData?: {
    fileName: string;
    fileMimeType: string;
    fileSize: number;
  };
  expiresAt: Date;
}

export interface GetSecretOptions {
  userId?: string;
  request: {
    ip: string;
    userAgent: string;
  };
}

export async function getSecret(keySignature: string, options: GetSecretOptions): Promise<GetSecretResult> {
  const { userId, request } = options;

  // Get the secret from the database
  const dbSecret = await db
    .select()
    .from(secrets)
    .where(eq(secrets.accessToken, keySignature))
    .limit(1)
    .then(result => result[0]);

  if (!dbSecret) {
    throw new Error("Secret not found");
  }

  // Check if secret has expired
  if (dbSecret.expiresAt < new Date()) {
    await db.delete(secrets).where(eq(secrets.accessToken, keySignature));
    throw new Error("Secret has expired");
  }

  try {
    // Get the execution secret key
    const executionSecretKey = await deriveKey(SECRET_KEY);

    // Convert the encrypted key string from hex to Uint8Array
    const encryptedKeyBytes = new Uint8Array(
      dbSecret.key.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []
    );

    // Decrypt the key string with the execution secret key
    const keyString = await decrypt(encryptedKeyBytes, executionSecretKey);

    // Convert the key string back to a CryptoKey
    const key = await stringToKey(keyString);

    // Convert the encrypted data from hex to Uint8Array
    const encryptedDataBytes = new Uint8Array(
      dbSecret.encryptedData.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) ?? []
    );

    // Decrypt the secret with the recovered key
    const decryptedSecret = await decrypt(encryptedDataBytes, key);

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
      await db.delete(secrets).where(eq(secrets.accessToken, keySignature));
    }

    // If the secret is a file, parse the JSON data
    if (dbSecret.type === 'file') {
      try {
        const fileData = JSON.parse(decryptedSecret);
        
        // Convert the secret array to base64 efficiently
        const base64Content = arrayBufferToBase64(fileData.secret);

        return {
          type: 'file',
          content: base64Content,
          fileData: {
            fileName: fileData.fileName,
            fileMimeType: fileData.fileMimeType,
            fileSize: fileData.fileSize,
          },
          expiresAt: dbSecret.expiresAt,
        };
      } catch (error) {
        console.error('File parsing error:', error);
        throw new Error("Failed to parse file data");
      }
    }

    // For text secrets, return the decrypted content directly
    return {
      type: 'text',
      content: decryptedSecret,
      expiresAt: dbSecret.expiresAt,
    };
  } catch (error) {
    throw error;
  }
}