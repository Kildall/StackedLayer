import { defineConfig } from "auth-astro";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "@auth/core/providers/google";
import Resend from "@auth/core/providers/resend";
import Github from "@auth/core/providers/github";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens } from "@/db/schema";
import {
  AUTH_ENABLED,
  AUTH_SECRET,
  AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET,
  AUTH_RESEND_KEY,
  AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET,
  TURNSTILE_SECRET_KEY,
} from "astro:env/server";

export default defineConfig({
  secret: AUTH_SECRET,
  adapter: AUTH_ENABLED
    ? DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      })
    : undefined,
  providers: AUTH_ENABLED
    ? [
        Github({
          clientId: AUTH_GITHUB_ID,
          clientSecret: AUTH_GITHUB_SECRET,
        }),
        Google({
          clientId: AUTH_GOOGLE_ID,
          clientSecret: AUTH_GOOGLE_SECRET,
          allowDangerousEmailAccountLinking: true,
        }),
        Resend({
          from: "no-reply@stackedlayer.com",
          apiKey: AUTH_RESEND_KEY,
        }),
      ]
    : [],
  pages: {
    signIn: AUTH_ENABLED ? "/login" : "/",
    newUser: AUTH_ENABLED ? "/" : "/",
    signOut: AUTH_ENABLED ? "/" : "/",
    verifyRequest: AUTH_ENABLED ? "/verify-email" : "/",
    error: AUTH_ENABLED ? "/auth-error" : "/",
  },
  cfSecretKey: TURNSTILE_SECRET_KEY,
});
