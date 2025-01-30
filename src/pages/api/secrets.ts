import { createSecret } from "@/db/queries/create-secret";
import { withAuth, withSession } from "@/lib/protected-routes";
import type { APIRoute } from "astro";
import { MAX_SECRET_LENGTH, MAX_FILE_SIZE_MB } from "astro:env/server";
import { z } from "zod";
import { getSecret } from "@/db/queries/get-secret";

const bodySchema = z.object({
  secret: z.string(),
  type: z.enum(["secret", "file"]),
  fileName: z.string().optional(),
  fileMimeType: z.string().optional(),
  fileSize: z.number().optional(),
});

export const POST: APIRoute = withAuth(async (context) => {
  try {
    const { request, user } = context;
    const body = await request.json();

    const parsedBody = bodySchema.safeParse(body);
    if (!parsedBody.success) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 400,
      });
    }

    const { secret, type, fileName, fileMimeType, fileSize } = parsedBody.data;

    // Validate file data
    if (type === "file") {
      if (!fileName || !fileMimeType || !fileSize) {
        return new Response(JSON.stringify({ error: "Invalid file data" }), {
          status: 400,
        });
      }

      // Secret is the file content in base64
      const fileContent = Buffer.from(secret, "base64");
      if (fileContent.length > MAX_FILE_SIZE_MB * 1024 * 1024) {
        return new Response(JSON.stringify({ error: "File too large" }), {
          status: 400,
        });
      }
    }

    // Validate secret data
    if (type === "secret") {
      if (secret.length > MAX_SECRET_LENGTH) {
        return new Response(JSON.stringify({ error: "Secret too long" }), {
          status: 400,
        });
      }
    }

    // Create the secret
    if (type === "file") {
      const fileContent = new Uint8Array(Buffer.from(secret, "base64"));
      const dbSecret = await createSecret(fileContent, {
        email: user?.email,
        type,
        fileName,
        fileMimeType,
        fileSize,
        request: {
          ip: request.headers.get("x-forwarded-for") ?? "unknown",
          userAgent: request.headers.get("User-Agent") ?? "unknown",
        },
      });
      return new Response(JSON.stringify({ ...dbSecret }), { status: 200 });
    } else if (type === "secret") {
      const secretBytes = new TextEncoder().encode(secret);
      const dbSecret = await createSecret(secretBytes, {
        email: user?.email,
        type,
        request: {
          ip: request.headers.get("x-forwarded-for") ?? "unknown",
          userAgent: request.headers.get("User-Agent") ?? "unknown",
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

const querySchema = z.object({
  secret: z.string(),
});

export const GET: APIRoute = withSession(async (context) => {
  const { request, auth, url } = context;

  try {
    const paramSecret = url.searchParams.get("secret");
    const parsedQuery = querySchema.safeParse({ secret: paramSecret });
    if (!parsedQuery.success) {
      return new Response(JSON.stringify({ error: "Invalid secret" }), {
        status: 400,
      });
    }

    const { secret: keySignature } = parsedQuery.data;

    if (!keySignature) {
      return new Response(JSON.stringify({ error: "Secret not found" }), {
        status: 404,
      });
    }

    let userId: string | undefined;
    const user = auth?.user;
    if (user) {
      userId = user.id;
    }

    const secret = await getSecret(keySignature, {
      userId,
      request: {
        ip: request.headers.get("x-forwarded-for") ?? "unknown",
        userAgent: request.headers.get("User-Agent") ?? "unknown",
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
