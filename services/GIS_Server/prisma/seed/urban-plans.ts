import { Prisma, PrismaClient } from '@prisma/client';
import cuid from 'cuid';

export async function seedUrbanPlans(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error('Required districts not found. Skipping urban plan seeding.');
    return;
  }

  const urbanPlansData = [
    {
      districtId: district1.id,
      planName: 'Quy hoạch phân khu 1/2000 Khu trung tâm 930ha',
      zoningType: 'Đất hỗn hợp (Thương mại - Dịch vụ - Du lịch)',
      description:
        'Phát triển khu vực trung tâm thành một trung tâm tài chính, thương mại và du lịch quốc tế.',
      issuedDate: new Date('2021-02-01'),
      geom: 'POLYGON((106.695 10.778, 106.705 10.778, 106.705 10.770, 106.695 10.770, 106.695 10.778))',
    },
    {
      districtId: district1.id,
      planName: 'Quy hoạch chi tiết 1/500 Khu bờ Tây sông Sài Gòn',
      zoningType: 'Đất công viên cây xanh và công trình công cộng',
      description:
        'Cải tạo cảnh quan bờ sông, xây dựng công viên và các không gian công cộng phục vụ cộng đồng.',
      issuedDate: new Date('2022-08-15'),
      geom: 'POLYGON((106.705 10.772, 106.710 10.772, 106.710 10.768, 106.705 10.768, 106.705 10.772))',
    },
    {
      districtId: district3.id,
      planName: 'Quy hoạch bảo tồn khu biệt thự Pháp cổ',
      zoningType: 'Khu dân cư hiện hữu cải tạo - Bảo tồn',
      description:
        'Bảo tồn kiến trúc và cảnh quan các khu biệt thự cũ, hạn chế xây dựng cao tầng.',
      issuedDate: new Date('2020-05-20'),
      geom: 'POLYGON((106.688 10.785, 106.692 10.785, 106.692 10.782, 106.688 10.782, 106.688 10.785))',
    },
  ];

  for (const data of urbanPlansData) {
    await prisma.$executeRaw(Prisma.sql`
            INSERT INTO "public"."urban_plans" (
                id, plan_name, zoning_type, description, issued_date, geom, "districtId", "createdAt", "updatedAt"
            ) VALUES (
                ${cuid()},
                ${data.planName},
                ${data.zoningType},
                ${data.description},
                ${data.issuedDate}::timestamp,
                ST_GeomFromText(${data.geom}, 4326),
                ${data.districtId},
                NOW(),
                NOW()
            )
        `);
  }
  console.log(`   > Seeded ${urbanPlansData.length} urban plan records.`);
}
