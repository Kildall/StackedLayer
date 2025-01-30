
import { db } from "@/db";
import { accessLogs, secrets } from "@/db/schema";
import { encrypt, generateKeySignature, keyToString, deriveKey } from "@/utils/encrypt";
import { FILE_EXPIRATION_SECONDS, LOGIN_REQUIRED, SECRET_EXPIRATION_SECONDS, SECRET_KEY } from "astro:env/server";
import { getUser } from "./get-user";

interface CreateSecretResult {
  accessToken: string;
  expiresAt: Date;
}

export interface CreateSecretOptions {
  email?: string;
  type: "secret" | "file";
  fileName?: string;
  fileMimeType?: string;
  fileSize?: number;
  request: {
    ip: string;
    userAgent: string;
  };
}

export async function createSecret(secret: Uint8Array, options: CreateSecretOptions): Promise<CreateSecretResult> {
  const { email, type, fileName, fileMimeType, fileSize, request } = options;
  let userId: string | undefined;
  if (LOGIN_REQUIRED) {
    if(!email) {
      throw new Error("Email is required");
    }
    // Get the user
    const user = await getUser(email);
    if (!user) {
      throw new Error("User not found");
    }
    userId = user.id;
  }

  // Generate a new key for the secret
  const key = await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  let secretToEncrypt: Uint8Array;
  
  // If type is file, we need to add the file name, mime type, and size to the secret
  if (type === "file") {
    if(!fileName || !fileMimeType || !fileSize) {
      throw new Error("File name, mime type, and size are required");
    }
    
    // Convert the Uint8Array to an array of numbers for JSON serialization
    const secretArray = Array.from(secret);
    
    const fileData = {
      secret: secretArray,
      fileName,
      fileMimeType,
      fileSize
    };

    // Convert the file data to a string for encryption
    secretToEncrypt = new TextEncoder().encode(JSON.stringify(fileData));
  } else {
    secretToEncrypt = secret;
  }

  // Encrypt the secret with the new key
  const encryptedSecret = await encrypt(secretToEncrypt, key);

  // Generate a signature for the key that will be used to access the secret
  const keySignature = await generateKeySignature(key);

  // Get the execution secret key
  const executionSecretKey = await deriveKey(SECRET_KEY);

  // Convert the key to a string and encrypt it with the execution secret key
  const keyString = await keyToString(key);
  const keyStringBytes = new TextEncoder().encode(keyString);
  const encryptedKeyString = await encrypt(keyStringBytes, executionSecretKey);

  const result = await insertSecret({ 
    encryptedKeyString, 
    encryptedSecret, 
    keySignature, 
    userId, 
    type 
  });

  await db.insert(accessLogs).values({
    userId,
    secretId: result.id,
    ip: request.ip,
    userAgent: request.userAgent,
    type: 'UPLOAD',
  });

  return {
    accessToken: result.accessToken,
    expiresAt: result.expiresAt,
  };
}

interface InsertSecretOptions {
  encryptedKeyString: string;
  encryptedSecret: string;
  keySignature: string;
  userId?: string;
  type: "secret" | "file";
}

async function insertSecret(options: InsertSecretOptions) {
  const { encryptedKeyString, encryptedSecret, keySignature, userId, type } = options;

  let expiresAt: Date;
  switch(type) {
    case "secret":
      expiresAt = new Date(Date.now() + 1000 * SECRET_EXPIRATION_SECONDS);
      break;
    case "file":
      expiresAt = new Date(Date.now() + 1000 * FILE_EXPIRATION_SECONDS);
      break;
  }

  return await db.insert(secrets).values({
    key: encryptedKeyString,
    encryptedData: encryptedSecret,
    accessToken: keySignature,
    expiresAt,
    userId,
    type,
  }).returning().then(result => result[0]);
}