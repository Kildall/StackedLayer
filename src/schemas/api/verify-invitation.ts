import { z } from "zod";

export const verifyInvitationBodySchema = z.object({
  token: z.string(),
  cf: z.string(),
});