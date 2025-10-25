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
      name: 'Bệnh viện Tân Định - Cơ sở 2',
      address: '237 Trần Hưng Đạo, P. Cô Giang',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.6932273 10.7651115)',
      details: {
        type: HospitalType.GENERAL,
        bedCapacity: 20,
        doctorCount: 50,
      },
    },
    {
      districtId: district1.id,
      name: 'Bệnh viện Đa Khoa Tân Định',
      address: '338 Hai Bà Trưng, P. Tân Định',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.68959123817164 10.790138777625685)',
      details: {
        type: HospitalType.GENERAL,
        bedCapacity: 250,
        doctorCount: 345,
      },
    },
    {
      districtId: district1.id,
      name: 'Bệnh viện Bệnh Nhiệt đới',
      address: '11 Đ. Trần Doãn Khanh, Đa Kao',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.6974043 10.7888402)',
      details: {
        type: HospitalType.SPECIALIZED,
        bedCapacity: 550,
        doctorCount: 763,
      },
    },
    {
      districtId: district1.id,
      name: 'Bệnh viện Từ Dũ',
      address: '284 Cống Quỳnh, P. Phạm Ngũ Lão',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.6974043 10.7888402)',
      details: {
        type: HospitalType.GENERAL,
        bedCapacity: 1200,
        doctorCount: 521,
      },
    },
    {
      districtId: district1.id,
      name: 'Bệnh viện Nhi Đồng 2',
      address: '14 Lý Tự Trọng, P. Bến Nghé',
      category: InfraCategory.HOSPITAL,
      geom: 'POINT(106.702899 10.781346)',
      details: {
        type: HospitalType.SPECIALIZED,
        bedCapacity: 1400,
        doctorCount: 300,
      },
    },
    {
      districtId: district1.id,
      name: 'Diamond Plaza Shopping Center',
      address: '34 Lê Duẩn, Bến Nghé',
      category: InfraCategory.MARKET,
      geom: 'POINT(106.698422 10.781213)',
      details: {
        type: MarketType.MALL,
        stallCount: 170,
      },
    },
    {
      districtId: district1.id,
      name: 'Siêu thị An Nam',
      address: '16-18 Đ. Hai Bà Trưng, P. Bến Nghé',
      category: InfraCategory.MARKET,
      geom: 'POINT(106.700756 10.773121)',
      details: {
        type: MarketType.SUPERMARKET,
        stallCount: 60,
      },
    },
    {
      districtId: district1.id,
      name: 'Takashimaya',
      address: '92-94 Đ. Nam Kỳ Khởi Nghĩa, P. Bến Nghé',
      category: InfraCategory.MARKET,
      geom: 'POINT(106.70066874779263 10.772975616746356)',
      details: {
        type: MarketType.MALL,
        stallCount: 150,
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
      "districtId": district1.id,
      "name": "Công viên Tào Đàn",
      "address": "55C Nguyễn Thị Minh Khai, P. Bến Thành",
      "category": InfraCategory.PARK,
      "geom": "POINT(106.693087 10.774802)",
      "details": {
        "area_m2": 100000
     }
    },
    {
      "districtId": district1.id,
      "name": "Công viên Lê Văn Tám",
      "address": "Hai Bà Trưng, P. Đa Kao",
      "category": InfraCategory.PARK,
      "geom": "POINT(106.693742 10.788220)",
      "details": {
        "area_m2": 100000
      }
    },
    {
      districtId: district3.id,
      name: 'Trường THPT Marie Curie',
      address: '159 Nam Kỳ Khởi Nghĩa, P. Võ Thị Sáu',
      category: InfraCategory.SCHOOL,
      geom: 'POINT(106.690756 10.782351)',
      details: {
        level: SchoolLevel.HIGH_SCHOOL,
        studentCapacity: 2000,
        teacherCount: 150,
      },
    },
    {
      districtId: district1.id,
      name: "Trường THCS Nguyễn Du",
      address: "139 Nguyễn Du, P. Bến Thành",
      category: InfraCategory.SCHOOL,
      geom: "POINT(106.662507 10.844266)",
      details: {
          level: SchoolLevel.SECONDARY,
          studentCapacity: 1200,
          teacherCount: 80
      },
    },
    {
      districtId: district1.id,
      name: "Trường THPT Trưng Vương",
      address: "31 Trần Nhật Duật, P. Tân Định",
      category: InfraCategory.SCHOOL,
      geom: "POINT(106.706383 10.785291)",
      details: {
        level: SchoolLevel.HIGH_SCHOOL,
        studentCapacity: 1500,
        teacherCount: 90
      }
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
    {
      districtId: district1.id,
      name: 'Tổng công ty Điện lực Thành phố Hồ Chí Minh',
      address: '35 Tôn Đức Thắng, P. Bến Nghé',
      category: InfraCategory.UTILITY,
      geom: 'POINT(106.70430244928002 10.783486674129337)',
      details: {
        type: UtilityType.POWER_PLANT,
        capacity: 0
      }
    },
    {
      districtId: district1.id,
      name: 'Cây xăng Petrolimex 03',
      address: 'Lê Thánh Tôn, P. Bến Thành',
      category: InfraCategory.UTILITY,
      geom: 'POINT(106.69521583408078 10.771423152955515)',
      details: {
        type: UtilityType.GAS_STATION,
        capacity: 3000
      }
    }
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
