/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { PrismaClient } from '@prisma/client';
import { seedDistricts } from './seed/districts';
import { seedWards } from './seed/wards';
import { seedInfrastructures } from './seed/infrastructures';
import { seedPopulations } from './seed/populations';
import { seedTerrains } from './seed/terrains';
import { seedAirQualities } from './seed/air-qualities';
import { seedWaterQualities } from './seed/water-qualities';
import { seedTraffics } from './seed/traffics';
import { seedAccidents } from './seed/accidents';
import { seedPublicTransports } from './seed/public-transports';
import { seedLandUses } from './seed/land-uses';
import { seedUrbanPlans } from './seed/urban-plans';

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
