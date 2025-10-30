/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PrismaClient, HousingType, IncomeLevel } from '@prisma/client';

export async function seedPopulations(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });
  const district4 = await prisma.district.findUnique({ where: { code: 'Q4' } });

  if (!district1 || !district3 || !district4) {
    console.error('Required districts not found. Skipping population seeding.');
    return;
  }

  const populationsData = [
    {
      districtId: district1.id,
      year: 2019,
      populationTotal: 142625,
      householdsTotal: 38428,
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
        { ageMin: 0, ageMax: 14, male: 17000, female: 18656 },
        { ageMin: 15, ageMax: 64, male: 42000, female: 47600 },
        { ageMin: 65, ageMax: null, male: 7000, female: 10400 },
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
        { ageMin: 15, ageMax: 64, male: 77503, female: 78497 },
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
          housingType: HousingType.NhaTrongHem,
        },
        {
          householdSize: 3,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
        {
          householdSize: 3,
          incomeLevel: IncomeLevel.Thap,
          housingType: HousingType.NhaTrongHem,
        },
        {
          householdSize: 3,
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.ChungCuCaoCap,
        },
        {
          householdSize: 4,
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.NhaTrongHem,
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
    {
      districtId: district4.id,
      year: 2019,
      populationTotal: 175329,
      householdsTotal: 50000,
      households: [
        {
          householdSize: 2,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.ChungCuCaoCap,
        },
        {
          householdSize: 2,
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.ChungCuCaoCap,
        },
        {
          householdSize: 2,
          incomeLevel: IncomeLevel.Cao,
          housingType: HousingType.NhaRieng,
        },
        {
          householdSize: 3,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
        {
          householdSize: 4,
          incomeLevel: IncomeLevel.TrungBinh,
          housingType: HousingType.NhaRieng,
        },
      ],
      demographics: [
        { ageMin: 0, ageMax: 14, male: 17000, female: 16000 },
        { ageMin: 15, ageMax: 64, male: 83000, female: 82000 },
        { ageMin: 65, ageMax: null, male: 2500, female: 2829 },
      ],
    },
    {
      districtId: district4.id,
      year: 2024,
      populationTotal: 190000,
      householdsTotal: 55000,
      households: [
        {
          householdSize: 2,
          incomeLevel: IncomeLevel.Thap,
          housingType: HousingType.NhaTrongHem,
        },
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
        {
          householdSize: 4,
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
        { ageMin: 0, ageMax: 14, male: 18000, female: 17200 },
        { ageMin: 15, ageMax: 64, male: 88000, female: 87000 },
        { ageMin: 65, ageMax: null, male: 3000, female: 3800 },
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
