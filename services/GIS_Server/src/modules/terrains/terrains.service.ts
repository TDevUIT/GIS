/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class TerrainsService {
  private readonly selectFields = Prisma.sql`
    t.id, t.elevation, t.slope, t.soil_type as "soilType",
    t."districtId", d.name as "districtName",
    t."createdAt", t."updatedAt", ST_AsGeoJSON(t.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."terrains" t
    LEFT JOIN "public"."districts" d ON t."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateTerrainDto) {
    const { districtId, geom, ...terrainData } = createDto;
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
      INSERT INTO "public"."terrains" (id, elevation, slope, soil_type, geom, "districtId", "updatedAt")
      VALUES (${id}, ${terrainData.elevation}, ${terrainData.slope}, ${terrainData.soilType}, ST_GeomFromText(${geom}, 4326), ${districtId}, NOW())
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }
  async findAll(districtId?: string) {
    const whereClause = districtId
      ? Prisma.sql`WHERE t."districtId" = ${districtId}`
      : Prisma.empty;
    const query = Prisma.sql`
      SELECT
        t.id, t.elevation, t.slope, t.soil_type as "soilType",
        t."districtId", d.name as "districtName",
        ST_AsGeoJSON(t.geom) as geom,
        CASE
          WHEN t.elevation IS NULL THEN 'UNKNOWN'
          WHEN t.elevation < 5 THEN 'VERY_LOW'
          WHEN t.elevation >= 5 AND t.elevation < 15 THEN 'LOW'
          WHEN t.elevation >= 15 AND t.elevation < 30 THEN 'MEDIUM'
          WHEN t.elevation >= 30 AND t.elevation < 50 THEN 'HIGH'
          ELSE 'VERY_HIGH'
        END as "elevationCategory"
      FROM "public"."terrains" t
      LEFT JOIN "public"."districts" d ON t."districtId" = d.id
      ${whereClause}
    `;

    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE t.id = ${id}
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Dữ liệu địa hình với ID "${id}" không tồn tại.`,
      );
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateTerrainDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists) {
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
      }
    }
    if (Object.keys(otherData).length > 0) {
      await this.prisma.terrain.update({ where: { id }, data: otherData });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."terrains" SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW() WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.terrain.delete({ where: { id } });
  }

  async findTerrainAtPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(t.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu địa hình tại tọa độ (${lng}, ${lat}).`,
      );
    }
    return result[0];
  }

  async findTerrainsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(t.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.prisma.$queryRaw(query);
  }
}
