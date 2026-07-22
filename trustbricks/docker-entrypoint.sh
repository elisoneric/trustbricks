#!/bin/sh

# Default DATABASE_URL if missing
export DATABASE_URL="${DATABASE_URL:-file:/app/data/dev.db}"

echo "==> Production Database URL: ${DATABASE_URL}"

# If using SQLite, ensure target directory exists and grant write permissions to nextjs user
case "$DATABASE_URL" in
  file:*)
    DB_PATH=$(echo "$DATABASE_URL" | sed 's/^file://')
    DB_DIR=$(dirname "$DB_PATH")
    echo "==> Ensuring database directory exists and is writable by nextjs: ${DB_DIR}"
    mkdir -p "$DB_DIR" 2>/dev/null || true
    chown -R nextjs:nodejs "$DB_DIR" 2>/dev/null || true
    chmod -R 775 "$DB_DIR" 2>/dev/null || true
    ;;
esac

echo "==> Applying database schema (prisma db push)"
su-exec nextjs npx prisma db push --accept-data-loss || echo "WARNING: prisma db push encountered an issue, proceeding to start server..."

echo "==> Syncing database seed & locations"
if [ -f "prisma/seed-direct-sqlite.js" ]; then
  su-exec nextjs node prisma/seed-direct-sqlite.js || echo "WARNING: node seed script encountered an issue, proceeding to start server..."
else
  su-exec nextjs npx prisma db seed || echo "WARNING: prisma db seed encountered an issue, proceeding to start server..."
fi

echo "==> Starting Next.js standalone server as nextjs user on PORT=${PORT:-3000}"
exec su-exec nextjs node server.js
