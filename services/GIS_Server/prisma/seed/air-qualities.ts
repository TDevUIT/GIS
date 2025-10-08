import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedAirQualities(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error(
      'Required districts not found. Skipping air quality seeding.',
    );
    return;
  }

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);

  const airQualitiesData = [
    {
      districtId: district1.id,
      geom: 'POINT(106.7019 10.7769)',
      pm25: 45.5,
      co2: 550,
      no2: 25.2,
      recordedAt: pastDate.toISOString(),
    },
    {
      districtId: district1.id,
      geom: 'POINT(106.6950 10.7700)',
      pm25: 52.1,
      co2: 610,
      no2: 30.5,
      recordedAt: pastDate.toISOString(),
    },
    {
      districtId: district3.id,
      geom: 'POINT(106.6850 10.7850)',
      pm25: 48.9,
      co2: 580,
      no2: 28.0,
      recordedAt: pastDate.toISOString(),
    },
  ];

  for (const data of airQualitiesData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."air_qualities" (id, pm25, co2, no2, recorded_at, geom, "districtId")
            VALUES (
                ${cuid()},
                ${data.pm25},
                ${data.co2},
                ${data.no2},
                ${data.recordedAt}::timestamp,
                ST_GeomFromText(${data.geom}, 4326),
                ${data.districtId}
            )
        `);
  }
  console.log(`   > Seeded ${airQualitiesData.length} air quality records.`);
}
