import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedTerrains(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district4 = await prisma.district.findUnique({ where: { code: 'Q4' } });

  if (!district1 || !district4) {
    console.error('Required districts not found. Skipping terrain seeding.');
    return;
  }

  const terrainsData = [
    {
      districtId: district1.id,
      elevation: 5.0,
      slope: 1.5,
      soilType: 'Đất phù sa bồi tụ',
      geom: 'POLYGON((106.705 10.772, 106.710 10.772, 106.710 10.768, 106.705 10.768, 106.705 10.772))',
    },
    {
      districtId: district1.id,
      elevation: 10.0,
      slope: 3.0,
      soilType: 'Đất xám trên nền cát',
      geom: 'POLYGON((106.695 10.780, 106.700 10.780, 106.700 10.775, 106.695 10.775, 106.695 10.780))',
    },
    {
      districtId: district4.id,
      elevation: 2.5,
      slope: 0.5,
      soilType: 'Đất phèn, bùn',
      geom: 'POLYGON((106.700 10.755, 106.705 10.755, 106.705 10.750, 106.700 10.750, 106.700 10.755))',
    },
  ];

  for (const terrain of terrainsData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."terrains" (id, elevation, slope, soil_type, geom, "districtId", "updatedAt")
            VALUES (
                ${cuid()},
                ${terrain.elevation},
                ${terrain.slope},
                ${terrain.soilType},
                ST_GeomFromText(${terrain.geom}, 4326),
                ${terrain.districtId},
                NOW()
            )
        `);
  }
  console.log(`   > Seeded ${terrainsData.length} terrain records.`);
}
