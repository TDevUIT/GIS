require('ts-node').register({
  transpileOnly: true,
  skipProject: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
  },
});

const { PrismaClient } = require('@prisma/client');

const { seedDistricts } = require('./seed/districts');
const { seedWards } = require('./seed/wards');
const { seedInfrastructures } = require('./seed/infrastructures');
const { seedPopulations } = require('./seed/populations');
const { seedTerrains } = require('./seed/terrains');
const { seedAirQualities } = require('./seed/air-qualities');
const { seedWaterQualities } = require('./seed/water-qualities');
const { seedTraffics } = require('./seed/traffics');
const { seedAccidents } = require('./seed/accidents');
const { seedPublicTransports } = require('./seed/public-transports');
const { seedLandUses } = require('./seed/land-uses');
const { seedUrbanPlans } = require('./seed/urban-plans');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting seeding process ---');

  await prisma.image.deleteMany();
  await prisma.accident.deleteMany();
  await prisma.school.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.park.deleteMany();
  await prisma.market.deleteMany();
  await prisma.utility.deleteMany();
  await prisma.household.deleteMany();
  await prisma.demographic.deleteMany();
  await prisma.infrastructure.deleteMany();
  await prisma.population.deleteMany();
  await prisma.terrain.deleteMany();
  await prisma.airQuality.deleteMany();
  await prisma.waterQuality.deleteMany();
  await prisma.traffic.deleteMany();
  await prisma.publicTransport.deleteMany();
  await prisma.landUse.deleteMany();
  await prisma.urbanPlan.deleteMany();
  await prisma.ward.deleteMany();
  await prisma.district.deleteMany();

  console.log('Old data deleted successfully.');

  console.log('Seeding districts...');
  await seedDistricts(prisma);
  console.log('Districts seeded successfully.');

  console.log('Seeding wards...');
  await seedWards(prisma);
  console.log('Wards seeded successfully.');

  console.log('Seeding infrastructures...');
  await seedInfrastructures(prisma);
  console.log('Infrastructures seeded successfully.');

  console.log('Seeding populations...');
  await seedPopulations(prisma);
  console.log('Populations seeded successfully.');

  console.log('Seeding terrains...');
  await seedTerrains(prisma);
  console.log('Terrains seeded successfully.');

  console.log('Seeding air qualities...');
  await seedAirQualities(prisma);
  console.log('Air qualities seeded successfully.');

  console.log('Seeding water qualities...');
  await seedWaterQualities(prisma);
  console.log('Water qualities seeded successfully.');

  console.log('Seeding traffics...');
  await seedTraffics(prisma);
  console.log('Traffics seeded successfully.');

  console.log('Seeding accidents...');
  await seedAccidents(prisma);
  console.log('Accidents seeded successfully.');

  console.log('Seeding public transports...');
  await seedPublicTransports(prisma);
  console.log('Public transports seeded successfully.');

  console.log('Seeding land uses...');
  await seedLandUses(prisma);
  console.log('Land uses seeded successfully.');

  console.log('Seeding urban plans...');
  await seedUrbanPlans(prisma);
  console.log('Urban plans seeded successfully.');

  console.log('--- Seeding finished ---');
}

main()
  .catch((e) => {
    console.error('An error occurred during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Disconnecting Prisma Client...');
    await prisma.$disconnect();
  });
