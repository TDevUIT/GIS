import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

const districtsData = [
  {
    code: 'Q1',
    name: 'Quận 1',
    areaKm2: 7.72,
    densityPerKm2: 26347,
    geom: 'POLYGON((106.6898 10.7885, 106.7118 10.7885, 106.7118 10.7580, 106.6898 10.7580, 106.6898 10.7885))',
  },
  {
    code: 'Q3',
    name: 'Quận 3',
    areaKm2: 4.92,
    densityPerKm2: 38656,
    geom: 'POLYGON((106.6775 10.7933, 106.6961 10.7933, 106.6961 10.7712, 106.6775 10.7712, 106.6775 10.7933))',
  },
  {
    code: 'Q4',
    name: 'Quận 4',
    areaKm2: 4.18,
    densityPerKm2: 41659,
    geom: 'POLYGON((106.6947 10.7640, 106.7125 10.7640, 106.7125 10.7483, 106.6947 10.7483, 106.6947 10.7640))',
  },
];

export async function seedDistricts(prisma: PrismaClient) {
  for (const district of districtsData) {
    const id = cuid();
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."districts" (id, code, name, geom, "area_km2", "density_per_km2", "updatedAt")
            VALUES (
                ${id}, 
                ${district.code}, 
                ${district.name}, 
                ST_GeomFromText(${district.geom}, 4326), 
                ${district.areaKm2},
                ${district.densityPerKm2},
                NOW()
            )
        `);
  }
}
