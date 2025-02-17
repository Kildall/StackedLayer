import { z } from "zod";

export const getSecretQuerySchema = z.object({
  secret: z.string(),
});
