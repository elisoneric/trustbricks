#!/bin/sh
set -e

echo "==> Applying database schema (prisma db push)"
npx prisma db push --skip-generate

if ! node prisma/check-seed.js; then
  echo "==> Database is empty, running seed"
  npx prisma db seed
else
  echo "==> Database already has data, skipping seed"
fi

echo "==> Starting Next.js server"
exec node server.js
