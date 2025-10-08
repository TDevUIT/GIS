import { PrismaClient } from '@prisma/client';

export async function seedAccidents(prisma: PrismaClient) {
  const leLoiStreet = await prisma.traffic.findFirst({
    where: { roadName: 'Đường Lê Lợi' },
  });
  const nkkNStreet = await prisma.traffic.findFirst({
    where: { roadName: 'Đường Nam Kỳ Khởi Nghĩa' },
  });

  if (!leLoiStreet || !nkkNStreet) {
    console.error(
      'Required traffic routes not found. Skipping accident seeding.',
    );
    return;
  }

  const date1 = new Date();
  date1.setDate(date1.getDate() - 10);
  const date2 = new Date();
  date2.setDate(date2.getDate() - 5);

  const accidentsData = [
    {
      trafficId: leLoiStreet.id,
      accidentDate: date1,
      severity: 'Ít nghiêm trọng',
      casualties: 0,
    },
    {
      trafficId: leLoiStreet.id,
      accidentDate: date2,
      severity: 'Nghiêm trọng',
      casualties: 2,
    },
    {
      trafficId: nkkNStreet.id,
      accidentDate: date2,
      severity: 'Ít nghiêm trọng',
      casualties: 1,
    },
  ];

  await prisma.accident.createMany({
    data: accidentsData,
  });

  console.log(`   > Seeded ${accidentsData.length} accident records.`);
}
