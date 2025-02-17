export interface GetSecretResult {
  type: 'text' | 'file';
  content?: string;
  expiresAt: Date;
}

export interface GetSecretOptions {
  userId?: string;
  request: {
    ip: string;
    userAgent: string;
  };
}