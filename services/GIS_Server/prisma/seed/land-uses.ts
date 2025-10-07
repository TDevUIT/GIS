import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedLandUses(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error('Required districts not found. Skipping land use seeding.');
    return;
  }

  const landUsesData = [
    {
      districtId: district1.id,
      type: 'Đất thương mại, dịch vụ',
      areaKm2: 2.5,
      year: 2023,
      geom: 'POLYGON((106.698 10.778, 106.705 10.778, 106.705 10.770, 106.698 10.770, 106.698 10.778))',
    },
    {
      districtId: district1.id,
      type: 'Đất cây xanh công viên',
      areaKm2: 0.15,
      year: 2023,
      geom: 'POLYGON((106.691 10.770, 106.694 10.770, 106.694 10.768, 106.691 10.768, 106.691 10.770))',
    },
    {
      districtId: district3.id,
      type: 'Đất ở đô thị',
      areaKm2: 1.8,
      year: 2023,
      geom: 'POLYGON((106.680 10.785, 106.685 10.785, 106.685 10.780, 106.680 10.780, 106.680 10.785))',
    },
    {
      districtId: district1.id,
      type: 'Đất ở đô thị',
      areaKm2: 1.2,
      year: 2020,
      geom: 'POLYGON((106.690 10.768, 106.693 10.768, 106.693 10.765, 106.690 10.765, 106.690 10.768))',
    },
  ];

  for (const data of landUsesData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."land_uses" (id, type, area_km2, year, geom, "districtId", "createdAt", "updatedAt")
            VALUES (
                ${cuid()},
                ${data.type},
                ${data.areaKm2},
                ${data.year},
                ST_GeomFromText(${data.geom}, 4326),
                ${data.districtId},
                NOW(),
                NOW()
            )
        `);
  }
  console.log(`   > Seeded ${landUsesData.length} land use records.`);
}
