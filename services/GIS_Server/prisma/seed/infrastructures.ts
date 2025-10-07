import {
  Prisma,
  PrismaClient,
  InfraCategory,
  SchoolLevel,
  HospitalType,
  MarketType,
  UtilityType,
} from '@prisma/client';
import cuid from 'cuid';

export async function seedInfrastructures(prisma: PrismaClient) {
  const district1 = await prisma.district.findUnique({ where: { code: 'Q1' } });
  const district3 = await prisma.district.findUnique({ where: { code: 'Q3' } });

  if (!district1 || !district3) {
    console.error(
      'Required districts not found. Skipping infrastructure seeding.',
    );
    return;
  }

  const infrastructuresData = [
    {
      districtId: district1.id,
      name: 'Bệnh viện Nhi Đồng 2',
      address: '14 Lý Tự Trọng, P. Bến Nghé',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.7011 10.7811)',
      details: {
        type: HospitalType.SPECIALIZED,
        bedCapacity: 1400,
        doctorCount: 300,
      },
    },
    {
      districtId: district1.id,
      name: 'Chợ Bến Thành',
      address: 'Đ. Lê Lợi, P. Bến Thành',
      category: InfraCategory.MARKET,
      geom: 'POINT(106.6984 10.7724)',
      details: {
        type: MarketType.TRADITIONAL,
        stallCount: 1500,
      },
    },
    {
      districtId: district1.id,
      name: 'Công viên 23/9',
      address: 'Đ. Phạm Ngũ Lão, P. Phạm Ngũ Lão',
      category: InfraCategory.PARK,
      geom: 'POINT(106.6923 10.7695)',
      details: {
        area: 90000,
      },
    },
    {
      districtId: district3.id,
      name: 'Trường THPT Marie Curie',
      address: '159 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu',
      category: InfraCategory.SCHOOL,
      geom: 'POINT(106.6919 10.7831)',
      details: {
        level: SchoolLevel.HIGH_SCHOOL,
        studentCapacity: 2000,
        teacherCount: 150,
      },
    },
    {
      districtId: district3.id,
      name: 'Nhà máy nước Sài Gòn',
      address: '1 Công trường Quốc Tế, P. Võ Thị Sáu',
      category: InfraCategory.UTILITY,
      geom: 'POINT(106.6974 10.7833)',
      details: {
        type: UtilityType.WATER_SUPPLY,
        capacity: 300000,
      },
    },
  ];

  let seededCount = 0;
  for (const infra of infrastructuresData) {
    const infraId = cuid();
    await prisma.$transaction(async (tx) => {
      await tx.$executeRaw(Prisma.sql`
                INSERT INTO "public"."infrastructures" (id, name, address, category, geom, "districtId", "updatedAt")
                VALUES (
                    ${infraId}, 
                    ${infra.name}, 
                    ${infra.address}, 
                    ${infra.category}::"InfraCategory", 
                    ST_GeomFromText(${infra.geom}, 4326), 
                    ${infra.districtId}, 
                    NOW()
                )
            `);

      switch (infra.category) {
        case InfraCategory.SCHOOL:
          await tx.school.create({ data: { ...infra.details, infraId } });
          break;
        case InfraCategory.HOSPITAL:
          await tx.hospital.create({ data: { ...infra.details, infraId } });
          break;
        case InfraCategory.PARK:
          await tx.park.create({ data: { ...infra.details, infraId } });
          break;
        case InfraCategory.MARKET:
          await tx.market.create({ data: { ...infra.details, infraId } });
          break;
        case InfraCategory.UTILITY:
          await tx.utility.create({ data: { ...infra.details, infraId } });
          break;
        default:
          break;
      }
    });
    seededCount++;
  }
  console.log(`   > Seeded ${seededCount} infrastructures.`);
}
