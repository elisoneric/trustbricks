#!/bin/sh

# Default DATABASE_URL if missing
export DATABASE_URL="${DATABASE_URL:-file:/app/data/dev.db}"

echo "==> Production Database URL: ${DATABASE_URL}"

# If using SQLite, ensure target directory exists
case "$DATABASE_URL" in
  file:*)
    DB_PATH=$(echo "$DATABASE_URL" | sed 's/^file://')
    DB_DIR=$(dirname "$DB_PATH")
    echo "==> Ensuring database directory exists at: ${DB_DIR}"
    mkdir -p "$DB_DIR" 2>/dev/null || true
    ;;
esac

echo "==> Applying database schema (prisma db push)"
npx prisma db push --accept-data-loss || echo "WARNING: prisma db push encountered an issue, proceeding to start server..."

echo "==> Syncing database seed & locations"
if [ -f "prisma/seed-direct-sqlite.js" ]; then
  node prisma/seed-direct-sqlite.js || echo "WARNING: node seed script encountered an issue, proceeding to start server..."
else
  npx prisma db seed || echo "WARNING: prisma db seed encountered an issue, proceeding to start server..."
fi

echo "==> Starting Next.js standalone server on PORT=${PORT:-3000}"
exec node server.js
