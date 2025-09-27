/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { InfraCategory, Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class InfrastructuresService {
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

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateInfrastructureDto) {
    const { districtId, category, school, hospital, park, market, utility } =
      createDto;
    const districtExists = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    return this.prisma.$transaction(async (tx) => {
      const infraId = cuid();
      await tx.$executeRaw`
        INSERT INTO "public"."infrastructures" (id, name, address, category, geom, "districtId", "updatedAt")
        VALUES (${infraId}, ${createDto.name}, ${createDto.address}, ${category}::"InfraCategory", ST_GeomFromText(${createDto.geom}, 4326), ${districtId}, NOW());
      `;
      switch (category) {
        case InfraCategory.SCHOOL:
          if (!school)
            throw new BadRequestException(
              'Thông tin chi tiết của trường học không được để trống.',
            );
          await tx.school.create({ data: { ...school, infraId } });
          break;
        case InfraCategory.HOSPITAL:
          if (!hospital)
            throw new BadRequestException(
              'Thông tin chi tiết của bệnh viện không được để trống.',
            );
          await tx.hospital.create({ data: { ...hospital, infraId } });
          break;
        case InfraCategory.PARK:
          if (!park)
            throw new BadRequestException(
              'Thông tin chi tiết của công viên không được để trống.',
            );
          await tx.park.create({ data: { ...park, infraId } });
          break;
        case InfraCategory.MARKET:
          if (!market)
            throw new BadRequestException(
              'Thông tin chi tiết của chợ/TTTM không được để trống.',
            );
          await tx.market.create({ data: { ...market, infraId } });
          break;
        case InfraCategory.UTILITY:
          if (!utility)
            throw new BadRequestException(
              'Thông tin chi tiết của tiện ích không được để trống.',
            );
          await tx.utility.create({ data: { ...utility, infraId } });
          break;
        default:
          break;
      }
      return this.findOne(infraId, tx);
    });
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
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTables} WHERE i.id = ${id}`;
    const result: any[] = await prismaClient.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(`Hạ tầng với ID "${id}" không tồn tại.`);
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateInfrastructureDto) {
    const existingInfra = await this.findOne(id);
    const { geom, school, hospital, park, market, utility, ...otherData } =
      updateDto;

    return this.prisma.$transaction(async (tx) => {
      if (Object.keys(otherData).length > 0) {
        await tx.infrastructure.update({
          where: { id },
          data: { ...otherData },
        });
      }
      if (geom) {
        await tx.$executeRaw`UPDATE "public"."infrastructures" SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW() WHERE id = ${id};`;
      }
      const categoryToUpdate = updateDto.category || existingInfra.category;
      switch (categoryToUpdate) {
        case InfraCategory.SCHOOL:
          if (school) {
            await tx.school.upsert({
              where: { infraId: id },
              update: school,
              create: { ...school, infraId: id },
            });
          }
          break;
        case InfraCategory.HOSPITAL:
          if (hospital) {
            await tx.hospital.upsert({
              where: { infraId: id },
              update: hospital,
              create: { ...hospital, infraId: id },
            });
          }
          break;
        case InfraCategory.PARK:
          if (park) {
            await tx.park.upsert({
              where: { infraId: id },
              update: park,
              create: { ...park, infraId: id },
            });
          }
          break;
        case InfraCategory.MARKET:
          if (market) {
            await tx.market.upsert({
              where: { infraId: id },
              update: market,
              create: { ...market, infraId: id },
            });
          }
          break;
        case InfraCategory.UTILITY:
          if (utility) {
            await tx.utility.upsert({
              where: { infraId: id },
              update: utility,
              create: { ...utility, infraId: id },
            });
          }
          break;
      }
      return this.findOne(id, tx);
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.infrastructure.delete({ where: { id } });
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
    return this.prisma.$queryRaw(query);
  }
}
