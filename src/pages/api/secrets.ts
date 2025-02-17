import { createSecret } from "@/db/queries/create-secret";
import { withAuth, withSession } from "@/lib/protected-routes";
import type { APIRoute } from "astro";
import { MAX_SECRET_LENGTH, MAX_FILE_SIZE_MB } from "astro:env/server";
import { z } from "zod";
import { getSecret } from "@/db/queries/get-secret";
import { createSecretSchema } from "@/schemas/api/create-secret";
import { getSecretQuerySchema } from "@/schemas/api/get-secret";

export const POST: APIRoute = withAuth(async (context) => {
  try {
    const { request, user } = context;
    const body = await request.json();

    const parsedBody = createSecretSchema.safeParse(body);
    if (!parsedBody.success) {
      console.log("Invalid secret", parsedBody.error);
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 400,
      });
    }

    const { secret, type } = parsedBody.data;

    // Validate file data
    if (type === "file") {
      // Secret is the file content in base64
      const fileContent = Buffer.from(secret, "base64");
      if (fileContent.length > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return new Response(JSON.stringify({ error: "File too large" }), {
          status: 400,
        });
      }
    }

    // Validate secret data
    if (type === "text") {
      if (secret.length > MAX_SECRET_LENGTH) {
        return new Response(JSON.stringify({ error: "Secret too long" }), {
          status: 400,
        });
      }
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = request.headers.get("User-Agent") ?? "unknown";

    // Create the secret
    if (type === "file") {
      const dbSecret = await createSecret(secret, {
        email: user?.email,
        type,
        request: {
          ip,
          userAgent,
        },
      });
      return new Response(JSON.stringify({ ...dbSecret }), { status: 200 });
    } else if (type === "text") {
      const dbSecret = await createSecret(secret, {
        email: user?.email,
        type,
        request: {
          ip,
          userAgent,
        },
      });
      return new Response(JSON.stringify({ ...dbSecret }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid secret type" }), {
      status: 400,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});


export const GET: APIRoute = withSession(async (context) => {
  const { request, auth, url } = context;

  try {
    const paramSecret = url.searchParams.get("secret");
    const parsedQuery = getSecretQuerySchema.safeParse({ secret: paramSecret });
    if (!parsedQuery.success) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 400,
      });
    }

    const { secret: secretId } = parsedQuery.data;

    if (!secretId) {
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
      });
    }

    let userId: string | undefined;
    const user = auth?.user;
    if (user) {
      userId = user.id;
    }

    const ip = request.headers.get("x-forwarded-for") ?? "unknown";
    const userAgent = request.headers.get("User-Agent") ?? "unknown";

    const secret = await getSecret(secretId, {
      userId,
      request: {
        ip,
        userAgent,
      },
    });

    return new Response(JSON.stringify({ ...secret }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});
