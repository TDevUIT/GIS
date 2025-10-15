import { PrismaClient, AccidentSeverity } from '@prisma/client';

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
  date1.setDate(date1.getDate() - 15);
  const date2 = new Date();
  date2.setDate(date2.getDate() - 7);
  const date3 = new Date();
  date3.setDate(date3.getDate() - 2);

  const accidentsData = [
    {
      trafficId: leLoiStreet.id,
      accidentDate: date1,
      severity: AccidentSeverity.LOW,
      casualties: 0,
    },
    {
      trafficId: leLoiStreet.id,
      accidentDate: date3,
      severity: AccidentSeverity.HIGH,
      casualties: 2,
    },
    {
      trafficId: nkkNStreet.id,
      accidentDate: date2,
      severity: AccidentSeverity.MEDIUM,
      casualties: 1,
    },
    {
      trafficId: nkkNStreet.id,
      accidentDate: date1,
      severity: AccidentSeverity.CRITICAL,
      casualties: 3,
    },
  ];

  await prisma.accident.createMany({
    data: accidentsData,
  });

  console.log(`   > Seeded ${accidentsData.length} accident records.`);
}
