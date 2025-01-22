import { validateInviteCode } from "@/lib/invite-code.ts";
import { z } from "zod";

export const numberFromStringSchema = z.string().transform((val) => {
  // Remove any non-numeric characters except decimal point and negative sign
  const cleaned = val.replace(/[^\d.-]/g, "");
  const parsed = parseInt(cleaned);

  // Return NaN if parsing fails or if the string is empty
  if (isNaN(parsed) || cleaned === "") {
    throw new Error("Invalid number format");
  }

  return parsed;
});

export const booleanFromStringSchema = z
  .string()
  .transform((val) => val === "true");

export const inviteCodeSchema = z
  .string({
    required_error: "Invite code is required",
  })
  .regex(
    /^[A-Z]{4}-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{5}$/,
    "Invalid invite code format"
  )
  .refine(
    (code) => validateInviteCode(code).isValid,
    (code) => ({ message: validateInviteCode(code).error })
  );
