FROM node:22-alpine AS base
# Prisma's schema/query engine binaries need OpenSSL & su-exec for privilege dropping
RUN apk add --no-cache openssl su-exec

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATABASE_URL="file:/app/data/dev.db"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy node_modules from BUILDER (crucial for Prisma generated engine binaries)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Schema + seed script + startup entrypoint
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Dedicated directory for SQLite data storage
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Uploaded images (About/leadership photos, property listings, gallery,
# blog covers) — served automatically by Next's standalone server since
# it reads public/ from disk at request time, not bundled at build time.
# Mount a persistent volume here in production or uploads won't survive
# a redeploy (same reasoning as /app/data above).
RUN mkdir -p public/uploads && chown -R nextjs:nodejs public/uploads

EXPOSE 3000

# Entrypoint runs as root initially to ensure mounted volume (/app/data) ownership,
# then uses su-exec to drop privileges to nextjs before executing server.js
ENTRYPOINT ["./docker-entrypoint.sh"]
