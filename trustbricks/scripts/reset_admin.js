const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  console.log("==================================================");
  console.log("  TRUSTBRICKS PUBLIC SITE — ADMIN USER HELPER");
  console.log("==================================================\n");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true }
  });

  console.log(`Found ${users.length} registered user(s) in database:\n`);
  users.forEach((u, i) => {
    console.log(`  [${i + 1}] Email: ${u.email}`);
    console.log(`      Name:  ${u.name}`);
    console.log(`      Role:  ${u.role}`);
    console.log(`      State: ${u.active ? 'Active' : 'Disabled'}`);
    console.log(`      Added: ${u.createdAt}`);
    console.log('--------------------------------------------------');
  });

  if (args.length < 2) {
    console.log("\nTo reset a password or create an admin, run:");
    console.log("  node scripts/reset_admin.js <email> <new_password> [role]\n");
    console.log("Example:");
    console.log("  node scripts/reset_admin.js admin@trustbrickspropertieslimited.com.ng MyNewPassword123! SUPER_ADMIN\n");
    return;
  }

  const [email, newPassword, role = "SUPER_ADMIN"] = args;
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { passwordHash, role, active: true }
    });
    console.log(`\n✅ Password successfully updated for: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   New Password: ${newPassword}`);
  } else {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email,
        passwordHash,
        role,
        active: true
      }
    });
    console.log(`\n✅ New admin user created: ${email}`);
    console.log(`   Role: ${role}`);
    console.log(`   Password: ${newPassword}`);
  }
}

main()
  .catch(e => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
