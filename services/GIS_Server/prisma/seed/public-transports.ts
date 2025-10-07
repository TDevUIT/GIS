import { Prisma, PrismaClient, TransportMode } from '@prisma/client';
import cuid from 'cuid';

export async function seedPublicTransports(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error(
      'Required districts not found. Skipping public transport seeding.',
    );
    return;
  }

  const transportsData = [
    {
      districtId: district1.id,
      routeName: 'Tuyến Xe buýt 01: Bến Thành - Bến xe Chợ Lớn',
      mode: TransportMode.BUS,
      capacity: 60,
      geom: 'LINESTRING(106.697 10.772, 106.694 10.768, 106.690 10.765)',
    },
    {
      districtId: district1.id,
      routeName: 'Tuyến Metro số 1: Bến Thành - Suối Tiên (Đoạn qua Q1)',
      mode: TransportMode.METRO,
      capacity: 930,
      geom: 'LINESTRING(106.698 10.772, 106.703 10.778)',
    },
    {
      districtId: district3.id,
      routeName: 'Tuyến Xe buýt 07: Bến xe Chợ Lớn - Gò Vấp',
      mode: TransportMode.BUS,
      capacity: 80,
      geom: 'LINESTRING(106.680 10.780, 106.688 10.782)',
    },
  ];

  for (const data of transportsData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."public_transports" (id, route_name, mode, capacity, geom, "districtId")
            VALUES (
                ${cuid()}, 
                ${data.routeName}, 
                ${data.mode}::"TransportMode", 
                ${data.capacity}, 
                ST_GeomFromText(${data.geom}, 4326), 
                ${data.districtId}
            )
        `);
  }
  console.log(`   > Seeded ${transportsData.length} public transport routes.`);
}
