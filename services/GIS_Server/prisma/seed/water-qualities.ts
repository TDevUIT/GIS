import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedWaterQualities(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district4 = await prisma.district.findUnique({ where: { code: 'Q4' } });

  if (!district1 || !district4) {
    console.error(
      'Required districts not found. Skipping water quality seeding.',
    );
    return;
  }

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);

  const waterQualitiesData = [
    {
      districtId: district1.id,
      geom: 'POINT(106.705 10.770)',
      ph: 7.2,
      turbidity: 21.5,
      contaminationIndex: 2.8,
      recordedAt: pastDate.toISOString(),
    },
    {
      districtId: district4.id,
      geom: 'POINT(106.700 10.755)',
      ph: 6.9,
      turbidity: 35.2,
      contaminationIndex: 4.1,
      recordedAt: pastDate.toISOString(),
    },
  ];

  for (const data of waterQualitiesData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."water_qualities" (id, ph, turbidity, contamination_index, recorded_at, geom, "districtId")
            VALUES (
                ${cuid()},
                ${data.ph},
                ${data.turbidity},
                ${data.contaminationIndex},
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
