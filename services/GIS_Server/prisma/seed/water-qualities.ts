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
  const district4 = await prisma.district.findUnique({ where: { code: 'Q4' } });

  if (!district1 || !district4) {
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
      ph: 7.2,
      turbidity: 21.5,
      contaminationIndex: 2.8,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 10),
      ).toISOString(),
    },
    {
      districtId: district4.id,
      geom: 'POINT(106.700 10.755)',
      ph: 6.9,
      turbidity: 35.2,
      contaminationIndex: 4.1,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 5),
      ).toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.708 10.772)',
      ph: 5.8,
      turbidity: 45.0,
      contaminationIndex: 6.5,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 2),
      ).toISOString(),
    },
    {
      districtId: district4.id,
      geom: 'POINT(106.702 10.758)',
      ph: 9.2,
      turbidity: 15.1,
      contaminationIndex: 5.9,
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
