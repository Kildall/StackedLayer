export interface CreateSecretResponse {
  id: string;
  expiresAt: string;
}

export interface CreateSecretResult {
  id: string;
  key: string;
  expiresAt: Date;
}