/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient, HousingType, IncomeLevel } from '@prisma/client';

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
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.ChungCuCaoCap,
        },
        {
          householdSize: 4,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
        {
          householdSize: 5,
          incomeLevel: IncomeLevel.Thap,
          housingType: HousingType.NhaTrongHem,
        },
      ],
      demographics: [
        { ageMin: 0, ageMax: 14, male: 18000, female: 17500 },
        { ageMin: 15, ageMax: 64, male: 75000, female: 78000 },
        { ageMin: 65, ageMax: null, male: 3000, female: 3500 },
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
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.ChungCuCaoCap,
        },
        {
          householdSize: 4,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
      ],
      demographics: [
        { ageMin: 0, ageMax: 14, male: 19000, female: 18200 },
        { ageMin: 15, ageMax: 64, male: 78000, female: 79000 },
        { ageMin: 65, ageMax: null, male: 3100, female: 4200 },
      ],
    },
    {
      districtId: district3.id,
      year: 2023,
      populationTotal: 190300,
      householdsTotal: 49500,
      households: [
        {
          householdSize: 3,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
        {
          householdSize: 4,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaTrongHem,
        },
      ],
      demographics: [
        { ageMin: 0, ageMax: 14, male: 17000, female: 16500 },
        { ageMin: 15, ageMax: 64, male: 74000, female: 76000 },
        { ageMin: 65, ageMax: null, male: 2800, female: 4000 },
      ],
    },
  ];

  for (const data of populationsData) {
    const existing = await prisma.population.findUnique({
      where: {
        districtId_year: {
          districtId: data.districtId,
          year: data.year,
        },
      },
    });

    if (existing) {
      console.log(
        `   > Skipping population for district ${data.districtId} in ${data.year}, already exists.`,
      );
      continue;
    }

    const { households, demographics, ...populationInfo } = data;

    await prisma.$transaction(async (tx) => {
      const population = await tx.population.create({
        data: populationInfo,
      });

      if (households && households.length > 0) {
        await tx.household.createMany({
          data: households.map((h) => ({
            ...h,
            populationId: population.id,
          })),
        });
      }

      if (demographics && demographics.length > 0) {
        await tx.demographic.createMany({
          data: demographics.map((d) => ({
            ...d,
            populationId: population.id,
          })),
        });
      }
    });
  }
  console.log(`   > Seeded population records.`);
}
