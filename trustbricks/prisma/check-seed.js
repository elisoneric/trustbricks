// Exits 1 (needs seed) if the branches table is empty, 0 otherwise.
// Used by docker-entrypoint.sh to decide whether to run `prisma db seed`
// on container startup, so a fresh/empty database gets populated once
// without re-seeding (and duplicating) on every restart.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.branch.count()
  .then((count) => {
    console.log(`Branch count: ${count}`);
    process.exit(count === 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('[check-seed] Could not query database:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
