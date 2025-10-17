import { Prisma, PrismaClient, TransportMode } from '@prisma/client';
import cuid from 'cuid';

export async function seedPublicTransports(prisma: PrismaClient) {
  console.log('Seeding public transports...');
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error(
      'Required districts not found. Skipping public transport seeding.',
    );
    return;
  }

  await prisma.publicTransport.deleteMany({});

  const transportsData = [
    {
      districtId: district1.id,
      routeName: 'Tuyến Xe buýt 01: Bến Thành - Bến xe Chợ Lớn',
      mode: TransportMode.BUS,
      capacity: 60,
      stopsCount: 15,
      frequencyMin: 10,
      operatingHours: '05:00 - 21:00',
      geom: 'LINESTRING(106.697 10.772, 106.694 10.768, 106.690 10.765)',
    },
    {
      districtId: district1.id,
      routeName: 'Tuyến Metro số 1: Bến Thành - Suối Tiên (Đoạn qua Q1)',
      mode: TransportMode.METRO,
      capacity: 930,
      stopsCount: 3,
      frequencyMin: 5,
      operatingHours: '05:30 - 22:30',
      geom: 'LINESTRING(106.698 10.772, 106.703 10.778)',
    },
    {
      districtId: district3.id,
      routeName: 'Tuyến Xe buýt 07: Bến xe Chợ Lớn - Gò Vấp',
      mode: TransportMode.BUS,
      capacity: 80,
      stopsCount: 22,
      frequencyMin: 15,
      operatingHours: '05:15 - 20:45',
      geom: 'LINESTRING(106.680 10.780, 106.688 10.782)',
    },
    {
      districtId: district1.id,
      routeName: 'Tuyến Buýt Sông số 1: Bạch Đằng - Linh Đông',
      mode: TransportMode.WATERWAY,
      capacity: 75,
      stopsCount: 5,
      frequencyMin: 60,
      operatingHours: '08:30 - 18:30',
      geom: 'LINESTRING(106.705 10.771, 106.710 10.775)',
    },
  ];

  for (const data of transportsData) {
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "public"."public_transports"
        (id, route_name, mode, capacity, stops_count, frequency_min, operating_hours, geom, "districtId", "createdAt", "updatedAt")
      VALUES (
        ${cuid()},
        ${data.routeName},
        ${data.mode}::"TransportMode",
        ${data.capacity},
        ${data.stopsCount},
        ${data.frequencyMin},
        ${data.operatingHours},
        ST_GeomFromText(${data.geom}, 4326),
        ${data.districtId},
        NOW(),
        NOW()
      )
    `);
  }

  console.log(`   > Seeded ${transportsData.length} public transport routes.`);
}
