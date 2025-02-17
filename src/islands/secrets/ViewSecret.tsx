import { importKey } from "@/utils/encrypt";
import { decryptData } from "@/utils/encrypt";
import type { GetSecretResult } from "@/types/db/queries/get-secret";
import type { DecryptedSecret } from "@/types/islands/secrets/view-secret";
import type { FileData } from "../landing/file-upload/FileUpload";

export async function fetchAndDecryptSecret(id: string, keyString: string): Promise<DecryptedSecret> {
  // Fetch encrypted data from server
  const response = await fetch(`/api/secrets?secret=${id}`);

  if (!response.ok) {
    if(response.headers.get("Content-Type") === "application/json") {
      const data = await response.json();
      throw new Error(data.error);
    } else {
      throw new Error("An error occurred");
    }
  }

  const data: GetSecretResult = await response.json();
  
  // Import the key
  const key = await importKey(keyString);

  if(!data.content) {
    throw new Error("No content found");
  }

  const decryptedContent = await decryptData(data.content, key);

  if (data.type === "file") {
    const decryptedBytes = new Uint8Array(decryptedContent);
    // Find the separator
    const separatorIndex = decryptedBytes.indexOf(0);
    
    // Split metadata and file content
    const metadataBytes = decryptedBytes.slice(0, separatorIndex);
    const fileBytes = decryptedBytes.slice(separatorIndex + 1);
    
    const fileMetadata = JSON.parse(new TextDecoder().decode(metadataBytes));
    
    return {
      type: data.type,
      content: Uint8Array.from(fileBytes),
      fileData: {
        fileName: fileMetadata.fileName,
        fileMimeType: fileMetadata.fileMimeType,
        fileSize: fileMetadata.fileSize,
      },
      expiresAt: data.expiresAt,
    };
  }

  const result: DecryptedSecret = {
    type: data.type,
    content: decryptedContent,
    expiresAt: data.expiresAt,
  };
  
  return result;
}