export interface SecretResponse {
  type: "text" | "file";
  content: string;
  expiresAt: string;
  fileData?: {
    fileName: string;
    fileMimeType: string;
    fileSize: number;
  };
}

export interface SecretURL {
  id: string;
  key: string;
}