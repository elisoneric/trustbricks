import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Branches with placeholder contact details (to be edited via admin panel)
  const branches = [
    { name: 'Abuja', email: 'abuja@trustbrickproperties.ng', whatsapp: '+2347078387777', phone: '+2347078387777', city: 'Abuja', state: 'FCT', address: 'Area 3, block 5, House 4 Cross River Street Garki, Abuja', landmark: 'Cross River Street Garki' },
    { name: 'Lagos', email: 'lagos@trustbrickproperties.ng', whatsapp: '+2349065652920', phone: '+2349065652920', city: 'Lagos', state: 'Lagos', address: 'Towry Close, Idejo Street, Off Adeola Odeku, Victoria Island, Lagos', landmark: 'Off Adeola Odeku, Victoria Island' },
    { name: 'Kano', email: 'kano@trustbrickproperties.ng', whatsapp: '+2348085537624', phone: '+2348085537624', city: 'Kano', state: 'Kano', address: '10/24 Ruqayya Plaza, Civic Centre, Opposite MTN', landmark: 'Opposite MTN, Civic Centre' },
    { name: 'Kwara', email: 'kwara@trustbrickproperties.ng', whatsapp: '', phone: '', city: 'Ilorin', state: 'Kwara', address: '', landmark: '' },
    { name: 'Adamawa', email: 'adamawa@trustbrickproperties.ng', whatsapp: '+2349136881719', phone: '+2349136881719', city: 'Yola', state: 'Adamawa', address: 'Abdullahi Bashir Road, Dougerei', landmark: 'Dougerei' },
    { name: 'Benue', email: 'benue@trustbrickproperties.ng', whatsapp: '+2347037382530', phone: '+2347037382530', city: 'Makurdi', state: 'Benue', address: 'No 7 Ashby Investment House, New Bridge Road, Makurdi', landmark: 'Contact: Mr James Gyuren' },
    { name: 'Ogun', email: 'ogun@trustbrickproperties.ng', whatsapp: '', phone: '', city: 'Abeokuta', state: 'Ogun', address: '', landmark: '' },
    { name: 'Lokoja', email: 'lokoja@trustbrickproperties.ng', whatsapp: '', phone: '', city: 'Lokoja', state: 'Kogi', address: '', landmark: '' },
    { name: 'Calabar', email: 'calabar@trustbrickproperties.ng', whatsapp: '', phone: '', city: 'Calabar', state: 'Cross River', address: '', landmark: '' },
    { name: 'Minna', email: 'minna@trustbrickproperties.ng', whatsapp: '+2348020772033', phone: '+2348020772033', city: 'Minna', state: 'Niger', address: 'Jaiye Plaza, Shiroro Road, opposite Unity Block, Minna', landmark: 'Opposite Unity Block' },
    { name: 'Ibadan', email: 'ibadan@trustbrickproperties.ng', whatsapp: '+2347031631941', phone: '+2347031631941', city: 'Ibadan', state: 'Oyo', address: 'No 19 Oshin Street, Bodija Estate, Ibadan', landmark: 'Bodija Estate' },
    { name: 'Ekiti', email: 'ekiti@trustbrickproperties.ng', whatsapp: '', phone: '', city: 'Ado-Ekiti', state: 'Ekiti', address: '', landmark: '' },
    { name: 'Bauchi', email: 'bauchi@trustbrickproperties.ng', whatsapp: '+2349032899612', phone: '+2349032899612', city: 'Bauchi', state: 'Bauchi', address: 'F1 Jos Road, Adjacent AHMIS Filling Station, Bauchi', landmark: 'Adjacent AHMIS Filling Station' },
    { name: 'Kaduna', email: 'kaduna@trustbrickproperties.ng', whatsapp: '+2348141735416', phone: '+2348141735416', city: 'Kaduna', state: 'Kaduna', address: 'First Floor, Suite 212, 11 Course Road, Opp 54 Complex AMSSCO Plaza by Murtala Square, Kaduna', landmark: 'Opp 54 Complex AMSSCO Plaza by Murtala Square' },
  ];

  for (const branch of branches) {
    await prisma.branch.upsert({
      where: { name: branch.name },
      update: { address: branch.address, city: branch.city, state: branch.state, landmark: branch.landmark, whatsapp: branch.whatsapp, phone: branch.phone },
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
