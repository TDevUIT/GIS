import { Prisma, PrismaClient, QualityLevel } from '@prisma/client';
import cuid from 'cuid';

function determineAirQualityLevel(pm25?: number | null): QualityLevel | null {
  if (pm25 == null) return null;
  if (pm25 <= 12.0) return QualityLevel.GOOD;
  if (pm25 <= 35.4) return QualityLevel.MODERATE;
  if (pm25 <= 55.4) return QualityLevel.UNHEALTHY;
  return QualityLevel.HAZARDOUS;
}

export async function seedAirQualities(prisma: PrismaClient) {
  console.log('Seeding air qualities...');
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error(
      'Required districts not found. Skipping air quality seeding.',
    );
    return;
  }

  await prisma.airQuality.deleteMany({});

  const airQualitiesData = [
    {
      districtId: district1.id,
      geom: 'POINT(106.7019 10.7769)',
      pm25: 11.5,
      co2: 420,
      no2: 15,
      recordedAt: new Date(
        new Date().setDate(new Date().getDate() - 2),
      ).toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.6950 10.7700)',
      pm25: 25.1,
      co2: 480,
      no2: 22,
      recordedAt: new Date(
        new Date().setHours(new Date().getHours() - 12),
      ).toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.6850 10.7850)',
      pm25: 48.9,
      co2: 580,
      no2: 28.0,
      recordedAt: new Date().toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.688 10.782)',
      pm25: 60.1,
      co2: 650,
      no2: 55,
      recordedAt: new Date(
        new Date().setHours(new Date().getHours() - 6),
      ).toISOString(),
    },
  ];

  for (const data of airQualitiesData) {
    const level = determineAirQualityLevel(data.pm25);

    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "public"."air_qualities" (id, pm25, co2, no2, level, recorded_at, geom, "districtId")
      VALUES (
        ${cuid()},
        ${data.pm25},
        ${data.co2},
        ${data.no2},
        ${level}::"QualityLevel",
        ${data.recordedAt}::timestamp,
        ST_GeomFromText(${data.geom}, 4326),
        ${data.districtId}
      )
    `);
  }

  console.log(`   > Seeded ${airQualitiesData.length} air quality records.`);
}
