FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies ---
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# --- Build ---
FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SITE_URL
ENV SITE_URL=${SITE_URL}
RUN pnpm build

# --- Production ---
FROM base AS runtime
WORKDIR /app
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 4321
CMD ["node", "dist/server/entry.mjs"]
