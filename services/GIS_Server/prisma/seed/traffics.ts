import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedTraffics(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error('Required districts not found. Skipping traffic seeding.');
    return;
  }

  const trafficsData = [
    {
      districtId: district1.id,
      roadName: 'Đường Lê Lợi',
      trafficVolume: 15000,
      geom: 'LINESTRING(106.6985 10.7725, 106.7025 10.7755)',
    },
    {
      districtId: district1.id,
      roadName: 'Đường Nguyễn Huệ',
      trafficVolume: 12000,
      geom: 'LINESTRING(106.7023 10.7770, 106.7048 10.7705)',
    },
    {
      districtId: district3.id,
      roadName: 'Đường Nam Kỳ Khởi Nghĩa',
      trafficVolume: 25000,
      geom: 'LINESTRING(106.6920 10.7900, 106.6905 10.7815)',
    },
  ];

  for (const data of trafficsData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."traffics" (id, road_name, traffic_volume, geom, "districtId", "updatedAt")
            VALUES (
                ${cuid()}, 
                ${data.roadName}, 
                ${data.trafficVolume}, 
                ST_GeomFromText(${data.geom}, 4326), 
                ${data.districtId}, 
                NOW()
            )
        `);
  }
  console.log(`   > Seeded ${trafficsData.length} traffic records.`);
}
