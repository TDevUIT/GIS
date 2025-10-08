/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

const wardsData = {
  Q1: [
    {
      code: '26800',
      name: 'Phường Bến Nghé',
      geom: 'POLYGON((106.699 10.788, 106.711 10.788, 106.711 10.770, 106.699 10.770, 106.699 10.788))',
    },
    {
      code: '26803',
      name: 'Phường Bến Thành',
      geom: 'POLYGON((106.692 10.776, 106.702 10.776, 106.702 10.767, 106.692 10.767, 106.692 10.776))',
    },
    {
      code: '26806',
      name: 'Phường Cầu Ông Lãnh',
      geom: 'POLYGON((106.696 10.767, 106.701 10.767, 106.701 10.762, 106.696 10.762, 106.696 10.767))',
    },
  ],
  Q3: [
    {
      code: '26860',
      name: 'Phường Võ Thị Sáu',
      geom: 'POLYGON((106.685 10.787, 106.696 10.787, 106.696 10.779, 106.685 10.779, 106.685 10.787))',
    },
    {
      code: '26851',
      name: 'Phường 4',
      geom: 'POLYGON((106.678 10.780, 106.686 10.780, 106.686 10.774, 106.678 10.774, 106.678 10.780))',
    },
  ],
  Q4: [
    {
      code: '27043',
      name: 'Phường 1',
      geom: 'POLYGON((106.700 10.763, 106.706 10.763, 106.706 10.758, 106.700 10.758, 106.700 10.763))',
    },
    {
      code: '27052',
      name: 'Phường 6',
      geom: 'POLYGON((106.695 10.758, 106.702 10.758, 106.702 10.753, 106.695 10.753, 106.695 10.758))',
    },
  ],
};

export async function seedWards(prisma: PrismaClient) {
  let seededCount = 0;
  for (const districtCode in wardsData) {
    const district = await prisma.district.findUnique({
      where: { code: districtCode },
    });

    if (!district) {
      console.warn(
        `District with code ${districtCode} not found. Skipping its wards.`,
      );
      continue;
    }

    const wardsForDistrict = wardsData[districtCode];
    for (const ward of wardsForDistrict) {
      await prisma.$executeRaw(Prisma.sql`
                INSERT INTO "public"."wards" (id, code, name, geom, "districtId", "updatedAt")
                VALUES (
                    ${cuid()}, 
                    ${ward.code}, 
                    ${ward.name}, 
                    ST_GeomFromText(${ward.geom}, 4326), 
                    ${district.id}, 
                    NOW()
                )
            `);
      seededCount++;
    }
  }
  console.log(`   > Seeded ${seededCount} wards.`);
}
