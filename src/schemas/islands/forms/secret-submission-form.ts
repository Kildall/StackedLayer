import { z } from "zod";

export const secretSubmissionFormSchema = z.object({
  secret: z.string({ required_error: "Secret is required" }).min(1, { message: "Secret is required" }),
});

export type SecretSubmissionFormValues = z.infer<typeof secretSubmissionFormSchema>;