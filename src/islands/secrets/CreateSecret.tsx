import { exportKey, encryptData, generateEncryptionKey } from "@/utils/encrypt";
import type { CreateSecretResponse, CreateSecretResult } from "@/types/islands/secrets/create-secret";

export async function createAndUploadSecret(data: Uint8Array, type: "text" | "file"): Promise<CreateSecretResult> {
  // Generate a new encryption key
  const key = await generateEncryptionKey();
  
  // Encrypt the data
  const encryptedData = await encryptData(data, key);
  
  // Send encrypted data to server
  const response = await fetch('/api/secrets', {
    method: 'POST',
    body: JSON.stringify({
      secret: encryptedData,
      type,
    }),
  });

  if (!response.ok) {
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const data = await response.json();
      throw new Error(data.error);
    }

    throw new Error('Failed to create secret');
  }

  const result: CreateSecretResponse = await response.json();
  
  // Export key for URL
  const keyString = await exportKey(key);
  
  // Return URL-safe strings
  return {
    id: result.id,
    key: keyString,
    expiresAt: new Date(result.expiresAt),
  };
}