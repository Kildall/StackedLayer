import z from "zod";
import dotenv from "dotenv";
import { booleanFromStringSchema, numberFromStringSchema } from "@/utils/schemas";

dotenv.config();

const envSchema = z.object({
  API_URL: z.string(),
  NEXT_PUBLIC_FRONTEND_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]),

  LOGIN_REQUIRED: booleanFromStringSchema,
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),

  ENFORCE_ONE_TIME: booleanFromStringSchema,

  SECRET_EXPIRATION_SECONDS: numberFromStringSchema,
  SECRET_MAX_LENGTH: numberFromStringSchema,

  FILE_EXPIRATION_SECONDS: numberFromStringSchema,
  FILE_MAX_FILE_SIZE_MB: numberFromStringSchema,
  
  DATA_ENCRYPTION_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
