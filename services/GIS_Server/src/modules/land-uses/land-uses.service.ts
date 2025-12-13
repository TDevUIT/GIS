/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { FindLandUsesQueryDto } from './dto/query.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class LandUsesService {
  private readonly selectFields = Prisma.sql`
    lu.id, lu.type, lu.area_km2 as "areaKm2", lu.year,
    lu."createdAt", lu."updatedAt", lu."districtId", d.name as "districtName",
    ST_AsGeoJSON(lu.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."land_uses" lu
    LEFT JOIN "public"."districts" d ON lu."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateLandUseDto) {
    const { districtId, year, type, geom, ...landUseData } = createDto;

    const districtExists = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!districtExists) {
      throw new BadRequestException(
        `District with ID "${districtId}" does not exist.`,
      );
    }

    const recordExists = await this.prisma.landUse.findUnique({
      where: { districtId_type_year: { districtId, type, year } },
    });
    if (recordExists) {
      throw new ConflictException(
        `Land use data for type "${type}" in district "${districtId}" for year "${year}" already exists.`,
      );
    }

    const id = cuid();
    const query = Prisma.sql`
      INSERT INTO "public"."land_uses" (id, type, area_km2, year, geom, "districtId", "updatedAt")
      VALUES (${id}, ${type}, ${landUseData.areaKm2}, ${year}, ST_GeomFromGeoJSON(${geom}), ${districtId}, NOW())
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll(queryDto: FindLandUsesQueryDto) {
    const { districtId, type } = queryDto;
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`lu."districtId" = ${districtId}`);
    }
    if (type) {
      whereClauses.push(Prisma.sql`lu.type ILIKE ${'%' + type + '%'}`);
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} ${where} ORDER BY lu.year DESC, lu.type ASC`;
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE lu.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);

    if (result.length === 0) {
      throw new NotFoundException(`Land use record with ID "${id}" not found.`);
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateLandUseDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;

    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists)
        throw new BadRequestException(
          `District with ID "${otherData.districtId}" does not exist.`,
        );
    }

    if (Object.keys(otherData).length > 0) {
      await this.prisma.landUse.update({
        where: { id },
        data: { ...otherData, updatedAt: new Date() },
      });
    }

    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."land_uses" SET geom = ST_GeomFromGeoJSON(${geom}), "updatedAt" = NOW() WHERE id = ${id};
      `;
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.landUse.delete({ where: { id } });
  }

  async findLandUseAtPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(lu.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      ORDER BY lu.year DESC
      LIMIT 1;
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `No land use data found at coordinate (${lng}, ${lat}).`,
      );
    }
    return result[0];
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(lu.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.prisma.$queryRaw(query);
  }
}
