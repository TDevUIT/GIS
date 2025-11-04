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
      geom: 'POLYGON((106.69291247875267 10.779313266844184,106.69320215732628 10.77903660421091,106.6928802922445 10.778715148260462,106.69277032167489 10.778799464608557,106.69267107994133 10.778701973828932,106.69251819402749 10.77883635300341,106.69291247875267 10.779313266844184))',
    },
    {
      districtId: district1.id,
      planName: 'Quy hoạch chi tiết 1/500 Khu bờ Tây sông Sài Gòn',
      zoningType: 'Đất công viên cây xanh và công trình công cộng',
      description:
        'Cải tạo cảnh quan bờ sông, xây dựng công viên và các không gian công cộng phục vụ cộng đồng.',
      issuedDate: new Date('2022-08-15'),
      geom: 'POLYGON((106.7066406123849 10.771411359001354,106.70655782042786 10.770915271189738,106.70654773818893 10.770539705218903,106.70660004126472 10.770226694962476,106.7066322277729 10.769984278495848,106.70658461856289 10.769738568128144,106.70641731577558 10.769555108647838,106.7061848017816 10.769491046020402,106.7060658625756 10.769449792315891,106.70594359156308 10.769428280277165,106.70598035668587 10.769507113142677,106.70611636354221 10.76959912081797,106.70630633937759 10.77002248545192,106.70643106209678 10.770459888879413,106.70645994817978 10.770664210565451,106.70639423405892 10.770820990448648,106.70642910277611 10.77111901181949,106.70645962518176 10.771421637852264,106.7066406123849 10.771411359001354))',
    },
    {
      districtId: district3.id,
      planName: 'Quy hoạch bảo tồn khu biệt thự Pháp cổ',
      zoningType: 'Khu dân cư hiện hữu cải tạo - Bảo tồn',
      description:
        'Bảo tồn kiến trúc và cảnh quan các khu biệt thự cũ, hạn chế xây dựng cao tầng.',
      issuedDate: new Date('2020-05-20'),
      geom: 'POLYGON((106.68852548311024 10.786257735126807,106.6888795347002 10.786012696749317,106.68899755189686 10.785857242191296,106.68915848443775 10.78598898334736,106.68892513225346 10.786270909227468,106.68867568681507 10.786434268027708,106.68852548311024 10.786257735126807))',
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
