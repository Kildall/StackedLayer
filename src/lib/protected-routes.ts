import { INVITE_ONLY } from "astro:env/server";
import { getUser, getUserWithInvite } from "@/db/queries/get-user";
import { getSession } from "auth-astro/server";
import type { User } from "@/db/schema";
import type { APIContext, APIRoute } from 'astro';
import type { Session } from "@auth/core/types";

interface ProtectedRouteResult {
  success: boolean;
  redirectTo?: string;
}

export async function protectRoute(request: Request): Promise<ProtectedRouteResult> {
  const currentPath = new URL(request.url).pathname;
  const session = await getSession(request);
  const user = session?.user;

  if (!user || !user.email) {
    return {
      success: false,
      redirectTo: "/login",
    };
  }

  const userData = await getUser(user.email);
  if (!userData) {
    return {
      success: false,
      redirectTo: "/",
    };
  }

  if (INVITE_ONLY && currentPath !== "/invite-only") {
    const { invitation } = userData;
    if (!invitation) {
      return {
        success: false,
        redirectTo: "/invite-only",
      };
    }
  }

  return {
    success: true,
  };
}


interface SessionAPIContext extends APIContext {
  auth: Session | null;
}

// Extended API context with session
interface AuthAPIContext extends SessionAPIContext {
  auth: Session | null;
  user: User;
}

// Type for the wrapped API handler
type WrappedAPIRoute = (context: SessionAPIContext) => ReturnType<APIRoute>;
type WrappedAPIRouteWithUser = (context: AuthAPIContext) => ReturnType<APIRoute>;

/**
 * Wraps an API route handler with session checking and context enhancement
 * @param handler The API route handler to wrap
 * @returns A wrapped API route handler with session support
 */
export function withSession(handler: WrappedAPIRoute): APIRoute {
  return async (context: APIContext) => {
    try {
      // Get the session from the request
      const session = await getSession(context.request);
      
      // Create the enhanced context with session
      const enhancedContext: SessionAPIContext = {
        ...context,
        auth: session,
      };

      // Call the handler with the enhanced context
      return await handler(enhancedContext);
    } catch (error) {
      console.error('API route error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  };
}

/**
 * Ensures that the user is logged in and has a valid session
 */
export function withAuth(handler: WrappedAPIRouteWithUser): APIRoute {
  return withSession(async (context) => {
    const { auth } = context;
    if (!auth || !auth.user || !auth.user.email) {
      return new Response('Unauthorized', { status: 401 });
    }
    const lookupUserFn = INVITE_ONLY ? getUserWithInvite : getUser;
    const user = await lookupUserFn(auth.user.email);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    const enhancedContext: AuthAPIContext = {
      ...context,
      auth: auth,
      user: user
    };
    return handler(enhancedContext);
  });
}