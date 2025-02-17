export interface DecryptedSecret {
  type: "text" | "file";
  content: Uint8Array;
  fileData?: {
    fileName: string;
    fileMimeType: string;
    fileSize: number;
  };
  expiresAt: Date;
}
