/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Prisma, PrismaClient, QualityLevel } from '@prisma/client';
import cuid from 'cuid';

function determineWaterQualityLevel(ph?: number | null): QualityLevel | null {
  if (ph == null) return null;
  if (ph >= 6.5 && ph <= 8.5) return QualityLevel.GOOD;
  if (ph >= 6.0 && ph < 9.0) return QualityLevel.MODERATE;
  if (ph >= 5.0 && ph < 9.5) return QualityLevel.UNHEALTHY;
  return QualityLevel.HAZARDOUS;
}

export async function seedWaterQualities(prisma: PrismaClient) {
  console.log('Seeding water qualities...');
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });
  const district4 = await prisma.district.findUnique({ where: { code: 'Q4' } });

  if (!district1 || !district3 || !district4) {
    console.error(
      'Required districts not found. Skipping water quality seeding.',
    );
    return;
  }

  await prisma.waterQuality.deleteMany({});

  const waterQualitiesData = [
    {
      districtId: district1.id,
      geom: 'POINT(106.705 10.770)',
      ph: 7.1,
      turbidity: 18.4,
      contaminationIndex: 2.9,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 10),
      ).toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.70468355583397 10.787387290958861)',
      ph: 6.9,
      turbidity: 22.1,
      contaminationIndex: 3.1,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 6),
      ).toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.698 10.765)',
      ph: 7.3,
      turbidity: 19.8,
      contaminationIndex: 2.7,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 5),
      ).toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.706 10.776)',
      ph: 7.2,
      turbidity: 21.5,
      contaminationIndex: 2.8,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 4),
      ).toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.680 10.785)',
      ph: 7.4,
      turbidity: 16.3,
      contaminationIndex: 2.5,
      recordedAt: new Date().toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.692 10.773)',
      ph: 6.8,
      turbidity: 25.1,
      contaminationIndex: 3.4,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 5),
      ).toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.69078934027348 10.783902389766444)',
      ph: 7.2,
      turbidity: 17.6,
      contaminationIndex: 2.6,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 2),
      ).toISOString(),
    },
    {
      districtId: district4.id,
      geom: 'POINT(106.708 10.757)',
      ph: 7.0,
      turbidity: 24.5,
      contaminationIndex: 3.2,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 7),
      ).toISOString(),
    },
    {
      districtId: district4.id,
      geom: 'POINT(106.7178468225646 10.75536196709436)',
      ph: 7.2,
      turbidity: 22.0,
      contaminationIndex: 3.0,
      recordedAt: new Date().toISOString(),
    },
  ];

  for (const data of waterQualitiesData) {
    const level = determineWaterQualityLevel(data.ph);

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "public"."water_qualities" (id, ph, turbidity, contamination_index, level, recorded_at, geom, "districtId")
      VALUES (
        ${cuid()},
        ${data.ph},
        ${data.turbidity},
        ${data.contaminationIndex},
        ${level}::"QualityLevel",
        ${data.recordedAt}::timestamp,
        ST_GeomFromText(${data.geom}, 4326),
        ${data.districtId}
      )
    `);
  }

  console.log(
    `   > Seeded ${waterQualitiesData.length} water quality records.`,
  );
}
