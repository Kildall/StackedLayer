import { defineConfig } from 'auth-astro';
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';
import { db } from '@/db';

const AUTH_ENABLED = import.meta.env.AUTH_ENABLED;

export default defineConfig({
  adapter: AUTH_ENABLED ? DrizzleAdapter(db) : undefined,
  providers: AUTH_ENABLED ? [
    Google({
      clientId: import.meta.env.AUTH_GOOGLE_ID,
      clientSecret: import.meta.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      from: 'no-reply@stackedlayer.com',
      apiKey: import.meta.env.AUTH_RESEND_KEY,
    })
  ] : [],
  pages: {
    signIn: AUTH_ENABLED ? '/login' : '/',
    newUser: AUTH_ENABLED ? '/': '/',
    signOut: AUTH_ENABLED ? '/': '/',
    verifyRequest: AUTH_ENABLED ? '/verify-email': '/',
  }
});
