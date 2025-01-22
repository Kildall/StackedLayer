// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import auth from 'auth-astro'
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://stackedlayer.com',
  integrations: [react(), tailwind({
    applyBaseStyles: false,
  }), sitemap(), auth({
    injectEndpoints: true,
  })],
  vite: {
    resolve: {
      alias: import.meta.env.PROD ? {
        "react-dom/server": "react-dom/server.edge",
      } : undefined,
    }
  },
  srcDir: './src',
  adapter: cloudflare(),

  env: {
    schema: {
      AUTH_DRIZZLE_URL: envField.string({
        context: 'server',
        access: 'secret',
        default: 'postgresql://postgres:postgres@localhost:5432/',
      }),
      TURNSTILE_SITE_KEY: envField.string({
        context: 'client',
        access: 'public',
        default: '',
      }),
      TURNSTILE_SECRET_KEY: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),

      MAX_FILE_SIZE_MB: envField.number({
        context: 'server',
        access: 'secret',
        min: 1,
        max: 100,
        default: 10,
      }),
      FILE_EXPIRATION_SECONDS: envField.number({
        context: 'server',
        access: 'secret',
        min: 1,
        max: 3600,
        default: 3600,
      }),

      MAX_SECRET_LENGTH: envField.number({
        context: 'server',
        access: 'secret',
        min: 1,
        max: 5000,
        default: 2000,
      }),
      SECRET_EXPIRATION_SECONDS: envField.number({
        context: 'server',
        access: 'secret',
        min: 1,
        max: 3600,
        default: 3600,
      }),


      ENFORCE_ONE_TIME: envField.boolean({
        context: 'server',
        access: 'secret',
        default: true,
      }),


      AUTH_ENABLED: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
      LOGIN_REQUIRED: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
      INVITE_ONLY: envField.boolean({
        context: 'server',
        access: 'secret',
        default: false,
      }),
      
      AUTH_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),
      AUTH_TRUST_HOST: envField.boolean({
        context: 'server',
        access: 'secret',
        default: true,
      }),

      AUTH_RESEND_KEY: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),

      AUTH_GOOGLE_ID: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),
      AUTH_GOOGLE_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        default: '',
      }),
    }
  }
});
