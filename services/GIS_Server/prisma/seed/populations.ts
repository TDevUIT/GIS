import { PrismaClient } from '@prisma/client';

export async function seedPopulations(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error('Required districts not found. Skipping population seeding.');
    return;
  }

  const populationsData = [
    {
      districtId: district1.id,
      year: 2022,
      populationTotal: 195000,
      householdsTotal: 48000,
      households: [
        {
          householdSize: 2,
          incomeLevel: 'Cao',
          housingType: 'Chung cư cao cấp',
        },
        { householdSize: 4, incomeLevel: 'Trung bình', housingType: 'Nhà phố' },
        { householdSize: 5, incomeLevel: 'Thấp', housingType: 'Nhà trong hẻm' },
      ],
      demographics: [
        { ageGroup: '0-14', male: 18000, female: 17500 },
        { ageGroup: '15-64', male: 75000, female: 78000 },
        { ageGroup: '65+', male: 3000, female: 3500 },
      ],
    },
    {
      districtId: district1.id,
      year: 2023,
      populationTotal: 200500,
      householdsTotal: 51000,
      households: [
        {
          householdSize: 2,
          incomeLevel: 'Cao',
          housingType: 'Chung cư cao cấp',
        },
        { householdSize: 4, incomeLevel: 'Trung bình', housingType: 'Nhà phố' },
      ],
      demographics: [
        { ageGroup: '0-14', male: 19000, female: 18200 },
        { ageGroup: '15-64', male: 78000, female: 79000 },
        { ageGroup: '65+', male: 3100, female: 4200 },
      ],
    },
    {
      districtId: district3.id,
      year: 2023,
      populationTotal: 190300,
      householdsTotal: 49500,
      households: [
        { householdSize: 3, incomeLevel: 'Trung bình', housingType: 'Nhà phố' },
        {
          householdSize: 4,
          incomeLevel: 'Trung bình-Khá',
          housingType: 'Nhà trong hẻm',
        },
      ],
      demographics: [
        { ageGroup: '0-14', male: 17000, female: 16500 },
        { ageGroup: '15-64', male: 74000, female: 76000 },
        { ageGroup: '65+', male: 2800, female: 4000 },
      ],
    },
  ];

  for (const data of populationsData) {
    const { households, demographics, ...populationInfo } = data;

    await prisma.$transaction(async (tx) => {
      const population = await tx.population.create({
        data: populationInfo,
      });

      if (households && households.length > 0) {
        const householdsWithId = households.map((h) => ({
          ...h,
          populationId: population.id,
        }));
        await tx.household.createMany({
          data: householdsWithId,
        });
      }

      if (demographics && demographics.length > 0) {
        const demographicsWithId = demographics.map((d) => ({
          ...d,
          populationId: population.id,
        }));
        await tx.demographic.createMany({
          data: demographicsWithId,
        });
      }
    });
  }
  console.log(`   > Seeded ${populationsData.length} population records.`);
}
