FROM node:lts-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS builder
COPY . .
RUN pnpm install --ignore-scripts

ARG TURNSTILE_SITE_KEY
ARG PUBLIC_FRONTEND_URL

ENV TURNSTILE_SITE_KEY=${TURNSTILE_SITE_KEY}
ENV PUBLIC_FRONTEND_URL=${PUBLIC_FRONTEND_URL}
ENV AUTH_SECRET=workaround
ENV NODE_ENV=production
ENV AUTH_ENABLED=true
ENV AUTH_TRUST_HOST=true

RUN pnpm run build

FROM base AS runtime
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist/ ./dist/
COPY --from=builder /app/node_modules/ ./node_modules/
COPY --from=builder /app/auth-astro/ ./auth-astro/
COPY --from=builder /app/public/ ./public/

ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
ENV AUTH_ENABLED=true
ENV AUTH_TRUST_HOST=true

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]