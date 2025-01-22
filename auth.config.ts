import { defineConfig } from 'auth-astro';
import { prisma } from '@/prisma';
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from '@auth/core/providers/google';
import Resend from '@auth/core/providers/resend';

const AUTH_ENABLED = import.meta.env.AUTH_ENABLED;

export default defineConfig({
  adapter: AUTH_ENABLED ? PrismaAdapter(prisma) : undefined,
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
