// src/pages/api/verify-token.ts
import type { APIRoute } from "astro";
import { TURNSTILE_SECRET_KEY } from "astro:env/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const prerender = false;

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const token = body.token;

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Verify the token with Cloudflare's API
    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);

    const result = await fetch(TURNSTILE_VERIFY_URL, {
      body: formData,
      method: "POST",
    });

    const outcome: TurnstileVerifyResponse = await result.json();

    if (outcome.success) {
      return new Response(
        JSON.stringify({
          ...outcome,
          success: true,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Token verification failed",
          "error-codes": outcome["error-codes"],
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};