// src/pages/api/verify-token.ts
import { getInvite } from "@/db/queries/get-invite";
import { getUser } from "@/db/queries/get-user";
import { useInvite } from "@/db/queries/use-invite";
import { withSession } from "@/lib/protected-routes";
import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = withSession(async (context) => {
  const { request, auth } = context;
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
    const invite = await getInvite(token);
    if(!invite) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invitation not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const email = auth?.user?.email;
    if(!email) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const user = await getUser(email);
    if(!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const success = await useInvite(token, user.id!);
    if(!success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invitation already used",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error(error);
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
});
