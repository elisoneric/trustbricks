import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Branches with placeholder contact details (to be edited via admin panel)
  const branches = [
    { name: 'Abuja', email: 'abuja@trustbrickproperties.ng', whatsapp: '+2348030000001', city: 'Abuja', state: 'FCT', address: 'Plot 234, Cadastral Zone B12, Wuse Zone 5', landmark: 'Near FCDA Secretariat' },
    { name: 'Lagos', email: 'lagos@trustbrickproperties.ng', whatsapp: '+2348050000002', city: 'Lagos', state: 'Lagos', address: '14 Broad Street, Lagos Island', landmark: 'Opposite First Bank HQ' },
    { name: 'Kano', email: 'kano@trustbrickproperties.ng', whatsapp: '+2348110000005', city: 'Kano', state: 'Kano', address: 'Plot 45, Murtala Muhammad Way, Kano', landmark: 'Near Kano Central Mosque' },
    { name: 'Kwara', email: 'kwara@trustbrickproperties.ng', whatsapp: '+2348110000006', city: 'Ilorin', state: 'Kwara', address: '18 Ibrahim Taiwo Road, Ilorin', landmark: 'Near Kwara State Stadium' },
    { name: 'Yola', email: 'adamawa@trustbrickproperties.ng', whatsapp: '+2348070000003', city: 'Yola', state: 'Adamawa', address: '12 Atiku Road, Jimeta, Yola', landmark: 'Near Adamawa State Government House' },
    { name: 'Benue', email: 'benue@trustbrickproperties.ng', whatsapp: '+2348110000007', city: 'Makurdi', state: 'Benue', address: '24 J.S. Tarka Road, Makurdi', landmark: 'Near Benue State University' },
    { name: 'Ogun', email: 'ogun@trustbrickproperties.ng', whatsapp: '+2348110000008', city: 'Abeokuta', state: 'Ogun', address: '10 Lalubu Street, Oke-Ilewo, Abeokuta', landmark: 'Near Abeokuta Sports Club' },
    { name: 'Lokoja', email: 'lokoja@trustbrickproperties.ng', whatsapp: '+2348110000009', city: 'Lokoja', state: 'Kogi', address: '5 Murtala Way, Lokoja', landmark: 'Near Kogi State Specialist Hospital' },
    { name: 'Calabar', email: 'calabar@trustbrickproperties.ng', whatsapp: '+2348110000010', city: 'Calabar', state: 'Cross River', address: '12 Marian Road, Calabar', landmark: 'Near Calabar Mall' },
    { name: 'Minna', email: 'minna@trustbrickproperties.ng', whatsapp: '+2348110000011', city: 'Minna', state: 'Niger', address: '6 Bosso Road, Minna', landmark: 'Near Federal University of Technology Minna' },
    { name: 'Ibadan', email: 'ibadan@trustbrickproperties.ng', whatsapp: '+2348110000012', city: 'Ibadan', state: 'Oyo', address: '30 Ring Road, Challenge, Ibadan', landmark: 'Near Challenge Bus Stop' },
    { name: 'Ekiti', email: 'ekiti@trustbrickproperties.ng', whatsapp: '+2348110000013', city: 'Ado-Ekiti', state: 'Ekiti', address: '15 Ado-Iworoko Road, Ado-Ekiti', landmark: 'Near Ekiti State University' },
    { name: 'Bauchi', email: 'bauchi@trustbrickproperties.ng', whatsapp: '+2348110000014', city: 'Bauchi', state: 'Bauchi', address: '8 Yakubu Bauchi Road, Bauchi', landmark: 'Near Bauchi State Government House' },
    { name: 'Kaduna', email: 'kaduna@trustbrickproperties.ng', whatsapp: '+2348090000004', city: 'Kaduna', state: 'Kaduna', address: '8 Ali Akilu Road, Kaduna North', landmark: 'Near Barau Dikko Teaching Hospital' },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { name: branch.name },
      update: {},
      create: branch,
    });
  }
  console.log('Branches seeded.');

  // 2. Seed 18 PFAs (14 known + 4 placeholders for admin panel later)
  const pfas = [
    { name: 'Stanbic IBTC', minimum_threshold: 5000000 },
    { name: 'GT Pension', minimum_threshold: 1000000 },
    { name: 'Citizens Pensions (Tier 1)', minimum_threshold: 500000 },
    { name: 'Citizens Pensions (Tier 2)', minimum_threshold: 200000 },
    { name: 'Trustfund', minimum_threshold: 500000 },
    { name: 'NUPEMCO', minimum_threshold: 500000 },
    { name: 'Tangerine APT', minimum_threshold: 500000 },
    { name: 'Norrenberger', minimum_threshold: 500000 },
    { name: 'NLPC', minimum_threshold: 500000 },
    { name: 'Premium', minimum_threshold: 500000 },
    { name: 'AccessARM', minimum_threshold: 500000 },
    { name: 'Leadway Pensure', minimum_threshold: 500000 },
    { name: 'Oak', minimum_threshold: 500000 },
    { name: 'CardinalStone', minimum_threshold: 500000 },
    { name: 'Crusader', minimum_threshold: 500000 },
    { name: 'FCMB', minimum_threshold: 500000 },
    { name: 'Fidelity', minimum_threshold: 500000 },
    { name: 'NPF', minimum_threshold: 500000 },
    { name: 'PAL', minimum_threshold: 500000 },
    { name: 'Veritas Glanvills', minimum_threshold: 500000 },
  ];

  for (const pfa of pfas) {
    await prisma.pfaRule.upsert({
      where: { name: pfa.name },
      update: { minimum_threshold: pfa.minimum_threshold },
      create: pfa,
    });
  }
  console.log('18 PFAs seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
