export interface CreateSecretResult {
  id: string;
  expiresAt: Date;
}

export interface CreateSecretOptions {
  email?: string;
  type: "text" | "file";
  request: {
    ip: string;
    userAgent: string;
  };
}
