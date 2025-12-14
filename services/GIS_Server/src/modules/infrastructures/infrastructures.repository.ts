import { Injectable } from '@nestjs/common';
import { InfraCategory, Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';

type ImageRecord = { id: string; url: string; publicId: string };

@Injectable()
export class InfrastructuresRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private readonly selectFields = Prisma.sql`
    i.id, i.name, i.address, i.category, i."districtId", d.name as "districtName",
    i."createdAt", i."updatedAt", ST_AsGeoJSON(i.geom) as geom,
    json_build_object(
      'level', s.level, 'studentCapacity', s.student_capacity, 'teacherCount', s.teacher_count,
      'type', h.type, 'bedCapacity', h.bed_capacity, 'doctorCount', h.doctor_count,
      'area', p.area,
      'marketType', m.type, 'stallCount', m.stall_count,
      'utilityType', u.type, 'capacity', u.capacity
    ) as details
  `;

  private readonly fromTables = Prisma.sql`
    FROM "public"."infrastructures" i
    LEFT JOIN "public"."districts" d ON i."districtId" = d.id
    LEFT JOIN "public"."schools" s ON i.id = s."infraId"
    LEFT JOIN "public"."hospitals" h ON i.id = h."infraId"
    LEFT JOIN "public"."parks" p ON i.id = p."infraId"
    LEFT JOIN "public"."markets" m ON i.id = m."infraId"
    LEFT JOIN "public"."utilities" u ON i.id = u."infraId"
  `;

  async districtExists(districtId: string): Promise<boolean> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      select: { id: true },
    });
    return Boolean(district);
  }

  async createWithDetails(params: {
    infraId: string;
    districtId: string;
    name: string;
    address?: string | null;
    category: InfraCategory;
    geomWkt: string;
    school?: Omit<Prisma.SchoolUncheckedCreateInput, 'infraId' | 'id'>;
    hospital?: Omit<Prisma.HospitalUncheckedCreateInput, 'infraId' | 'id'>;
    park?: Omit<Prisma.ParkUncheckedCreateInput, 'infraId' | 'id'>;
    market?: Omit<Prisma.MarketUncheckedCreateInput, 'infraId' | 'id'>;
    utility?: Omit<Prisma.UtilityUncheckedCreateInput, 'infraId' | 'id'>;
  }) {
    await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`
        INSERT INTO "public"."infrastructures" (id, name, address, category, geom, "districtId", "updatedAt")
        VALUES (${params.infraId}, ${params.name}, ${params.address}, ${params.category}::"InfraCategory", ST_GeomFromText(${params.geomWkt}, 4326), ${params.districtId}, NOW());
      `;

      switch (params.category) {
        case InfraCategory.SCHOOL:
          if (params.school) {
            await tx.school.create({
              data: {
                ...(params.school as Omit<
                  Prisma.SchoolUncheckedCreateInput,
                  'infraId' | 'id'
                >),
                infraId: params.infraId,
              },
            });
          }
          break;
        case InfraCategory.HOSPITAL:
          if (params.hospital) {
            await tx.hospital.create({
              data: {
                ...(params.hospital as Omit<
                  Prisma.HospitalUncheckedCreateInput,
                  'infraId' | 'id'
                >),
                infraId: params.infraId,
              },
            });
          }
          break;
        case InfraCategory.PARK:
          if (params.park) {
            await tx.park.create({
              data: {
                ...(params.park as Omit<
                  Prisma.ParkUncheckedCreateInput,
                  'infraId' | 'id'
                >),
                infraId: params.infraId,
              },
            });
          }
          break;
        case InfraCategory.MARKET:
          if (params.market) {
            await tx.market.create({
              data: {
                ...(params.market as Omit<
                  Prisma.MarketUncheckedCreateInput,
                  'infraId' | 'id'
                >),
                infraId: params.infraId,
              },
            });
          }
          break;
        case InfraCategory.UTILITY:
          if (params.utility) {
            await tx.utility.create({
              data: {
                ...(params.utility as Omit<
                  Prisma.UtilityUncheckedCreateInput,
                  'infraId' | 'id'
                >),
                infraId: params.infraId,
              },
            });
          }
          break;
      }
    });

    return this.findOne(params.infraId);
  }

  async findAll(districtId?: string, category?: InfraCategory) {
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`i."districtId" = ${districtId}`);
    }

    if (category) {
      whereClauses.push(Prisma.sql`i.category = ${category}::"InfraCategory"`);
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTables} ${where}`;
    return this.queryMany(query, withParsedGeom);
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    const radius = parseFloat(radiusInMeters);
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTables}
      WHERE ST_DWithin(
        i.geom::geography,
        ST_MakePoint(${parseFloat(lng)}, ${parseFloat(lat)})::geography,
        ${radius}
      )
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    return prismaClient.infrastructure.findUnique({
      where: { id },
      include: {
        school: true,
        hospital: true,
        park: true,
        market: true,
        utility: true,
        district: { select: { name: true } },
        images: {
          select: { id: true, url: true, publicId: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async updateWithDetails(params: {
    id: string;
    geomWkt?: string;
    category?: InfraCategory;
    name?: string;
    address?: string;
    districtId?: string;
    school?: Omit<Prisma.SchoolUncheckedCreateInput, 'infraId' | 'id'>;
    hospital?: Omit<Prisma.HospitalUncheckedCreateInput, 'infraId' | 'id'>;
    park?: Omit<Prisma.ParkUncheckedCreateInput, 'infraId' | 'id'>;
    market?: Omit<Prisma.MarketUncheckedCreateInput, 'infraId' | 'id'>;
    utility?: Omit<Prisma.UtilityUncheckedCreateInput, 'infraId' | 'id'>;
  }) {
    return this.prisma.$transaction(async (tx) => {
      if (params.name !== undefined || params.address !== undefined || params.category !== undefined || params.districtId !== undefined) {
        await tx.infrastructure.update({
          where: { id: params.id },
          data: {
            ...(params.name !== undefined ? { name: params.name } : {}),
            ...(params.address !== undefined ? { address: params.address } : {}),
            ...(params.category !== undefined ? { category: params.category } : {}),
            ...(params.districtId !== undefined ? { districtId: params.districtId } : {}),
          },
        });
      }

      if (params.geomWkt) {
        await tx.$executeRaw`UPDATE "public"."infrastructures" SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW() WHERE id = ${params.id};`;
      }

      const existing = await tx.infrastructure.findUnique({ where: { id: params.id } });
      const categoryToUpdate = params.category || existing?.category;

      if (categoryToUpdate) {
        switch (categoryToUpdate) {
          case InfraCategory.SCHOOL:
            if (params.school) {
              await tx.school.upsert({
                where: { infraId: params.id },
                update: params.school as Prisma.SchoolUncheckedUpdateInput,
                create: { ...(params.school as any), infraId: params.id },
              });
            }
            break;
          case InfraCategory.HOSPITAL:
            if (params.hospital) {
              await tx.hospital.upsert({
                where: { infraId: params.id },
                update: params.hospital as Prisma.HospitalUncheckedUpdateInput,
                create: { ...(params.hospital as any), infraId: params.id },
              });
            }
            break;
          case InfraCategory.PARK:
            if (params.park) {
              await tx.park.upsert({
                where: { infraId: params.id },
                update: params.park as Prisma.ParkUncheckedUpdateInput,
                create: { ...(params.park as any), infraId: params.id },
              });
            }
            break;
          case InfraCategory.MARKET:
            if (params.market) {
              await tx.market.upsert({
                where: { infraId: params.id },
                update: params.market as Prisma.MarketUncheckedUpdateInput,
                create: { ...(params.market as any), infraId: params.id },
              });
            }
            break;
          case InfraCategory.UTILITY:
            if (params.utility) {
              await tx.utility.upsert({
                where: { infraId: params.id },
                update: params.utility as Prisma.UtilityUncheckedUpdateInput,
                create: { ...(params.utility as any), infraId: params.id },
              });
            }
            break;
        }
      }

      return this.findOne(params.id, tx);
    });
  }

  async remove(id: string) {
    return this.prisma.infrastructure.delete({ where: { id } });
  }

  async findImages(infraId: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const images = await prismaClient.image.findMany({
      where: { infrastructureId: infraId },
      select: { id: true, url: true, publicId: true },
      orderBy: { createdAt: 'asc' },
    });
    return images as ImageRecord[];
  }

  async replaceImages(infraId: string, imagesData: Array<{ url: string; publicId: string }>) {
    return this.prisma.$transaction(async (tx) => {
      const oldImages = await this.findImages(infraId, tx);

      if (oldImages.length > 0) {
        await tx.image.deleteMany({ where: { infrastructureId: infraId } });
      }

      if (imagesData.length > 0) {
        await tx.image.createMany({
          data: imagesData.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            infrastructureId: infraId,
          })),
        });
      }

      const images = await this.findImages(infraId, tx);
      return { oldImages, images };
    });
  }

  async findImage(infraId: string, imageId: string) {
    const image = await this.prisma.image.findFirst({
      where: {
        id: imageId,
        infrastructureId: infraId,
      },
      select: { id: true, url: true, publicId: true },
    });
    return image as ImageRecord | null;
  }

  async deleteImage(imageId: string) {
    return this.prisma.image.delete({ where: { id: imageId } });
  }
}
