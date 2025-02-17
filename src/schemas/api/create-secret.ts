import { z } from "zod";

export const createSecretSchema = z.object({
  secret: z.string(),
  type: z.enum(["text", "file"]),
});