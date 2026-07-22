#!/bin/sh
set -e

echo "==> Applying database schema (prisma db push)"
npx prisma db push --skip-generate

echo "==> Syncing database seed & locations (npx prisma db seed)"
npx prisma db seed

echo "==> Starting Next.js server"
exec node server.js
