import { TURNSTILE_SECRET_KEY } from "astro:env/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(token: string) {
  try {
    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      body: formData,
      method: "POST",
    });

    const outcome: TurnstileVerifyResponse = await result.json();

    if (outcome.success) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
