/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrbanPlanDto } from './dto/create-urban-plan.dto';
import { UpdateUrbanPlanDto } from './dto/update-urban-plan.dto';
import { FindUrbanPlansQueryDto } from './dto/query.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class UrbanPlansService {
  private readonly selectFields = Prisma.sql`
    up.id, up.plan_name as "planName", up.zoning_type as "zoningType", up.description,
    up.issued_date as "issuedDate", up."createdAt", up."updatedAt",
    up."districtId", d.name as "districtName",
    ST_AsGeoJSON(up.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."urban_plans" up
    LEFT JOIN "public"."districts" d ON up."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateUrbanPlanDto) {
    const { districtId, geom, ...planData } = createDto;
    const districtExists = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    const id = cuid();
    const query = Prisma.sql`
      INSERT INTO "public"."urban_plans" (id, plan_name, zoning_type, description, issued_date, geom, "districtId", "updatedAt")
      VALUES (${id}, ${planData.planName}, ${planData.zoningType}, ${planData.description}, ${planData.issuedDate}::timestamp, ST_GeomFromText(${geom}, 4326), ${districtId}, NOW())
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll(queryDto: FindUrbanPlansQueryDto) {
    const { districtId, zoningType } = queryDto;
    const whereClauses: Prisma.Sql[] = [];
    if (districtId) {
      whereClauses.push(Prisma.sql`up."districtId" = ${districtId}`);
    }
    if (zoningType) {
      whereClauses.push(
        Prisma.sql`up.zoning_type ILIKE ${'%' + zoningType + '%'}`,
      );
    }
    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} ${where} ORDER BY up.issued_date DESC`;
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE up.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Đồ án quy hoạch với ID "${id}" không tồn tại.`,
      );
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateUrbanPlanDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists)
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
    }
    if (Object.keys(otherData).length > 0) {
      const dataToUpdate = { ...otherData };
      if (dataToUpdate.issuedDate) {
        dataToUpdate.issuedDate = new Date(
          dataToUpdate.issuedDate,
        ).toISOString();
      }
      await this.prisma.urbanPlan.update({
        where: { id },
        data: { ...dataToUpdate, updatedAt: new Date() },
      });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."urban_plans" SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW() WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.urbanPlan.delete({ where: { id } });
  }

  async findPlanAtPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(up.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      ORDER BY up.issued_date DESC
      LIMIT 1;
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy quy hoạch nào tại tọa độ (${lng}, ${lat}).`,
      );
    }
    return result[0];
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(up.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.prisma.$queryRaw(query);
  }
}
