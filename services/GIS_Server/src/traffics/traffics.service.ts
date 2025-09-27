/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';
import { FindTrafficsQueryDto } from './dto/query.dto';

@Injectable()
export class TrafficsService {
  private readonly selectFields = Prisma.sql`
    t.id, t.road_name as "roadName", t.traffic_volume as "trafficVolume",
    t."updatedAt", t."districtId", d.name as "districtName",
    ST_AsGeoJSON(t.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."traffics" t
    LEFT JOIN "public"."districts" d ON t."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTrafficDto) {
    const { districtId, geom, ...trafficData } = createDto;
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
      INSERT INTO "public"."traffics" (id, road_name, traffic_volume, geom, "districtId", "updatedAt")
      VALUES (${id}, ${trafficData.roadName}, ${trafficData.trafficVolume}, ST_GeomFromText(${geom}, 4326), ${districtId}, NOW())
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll(queryDto: FindTrafficsQueryDto) {
    const { districtId, roadName } = queryDto;
    const whereClauses: Prisma.Sql[] = [];
    if (districtId) {
      whereClauses.push(Prisma.sql`t."districtId" = ${districtId}`);
    }
    if (roadName) {
      whereClauses.push(Prisma.sql`t.road_name ILIKE ${'%' + roadName + '%'}`);
    }
    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} ${where} ORDER BY t."updatedAt" DESC`;
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE t.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(`Tuyến đường với ID "${id}" không tồn tại.`);
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateTrafficDto) {
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
    const dataToUpdate = { ...otherData, updatedAt: new Date() };
    if (Object.keys(otherData).length > 0) {
      await this.prisma.traffic.update({ where: { id }, data: dataToUpdate });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."traffics" SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW() WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.traffic.delete({ where: { id } });
  }

  async findTrafficsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(t.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.prisma.$queryRaw(query);
  }
}
