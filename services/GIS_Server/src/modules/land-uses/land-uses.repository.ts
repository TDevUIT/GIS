import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { FindLandUsesQueryDto } from './dto/query.dto';

@Injectable()
export class LandUsesRepository extends BaseRepository {
  private readonly selectFields = Prisma.sql`
    lu.id, lu.type, lu.area_km2 as "areaKm2", lu.year,
    lu."createdAt", lu."updatedAt", lu."districtId", d.name as "districtName",
    ST_AsGeoJSON(lu.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."land_uses" lu
    LEFT JOIN "public"."districts" d ON lu."districtId" = d.id
  `;

  async districtExists(districtId: string): Promise<boolean> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      select: { id: true },
    });
    return Boolean(district);
  }

  async recordExists(params: { districtId: string; type: string; year: number }) {
    const record = await this.prisma.landUse.findUnique({
      where: {
        districtId_type_year: {
          districtId: params.districtId,
          type: params.type,
          year: params.year,
        },
      },
      select: { id: true },
    });

    return Boolean(record);
  }

  async createRaw(params: {
    id: string;
    districtId: string;
    type: string;
    year: number;
    areaKm2: number;
    geomGeoJson: string;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."land_uses" (id, type, area_km2, year, geom, "districtId", "updatedAt")
      VALUES (
        ${params.id},
        ${params.type},
        ${params.areaKm2},
        ${params.year},
        ST_GeomFromGeoJSON(${params.geomGeoJson}),
        ${params.districtId},
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
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

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY lu.year DESC, lu.type ASC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE lu.id = ${id}`;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    type?: string;
    year?: number;
    areaKm2?: number;
    geomGeoJson?: string;
  }) {
    if (params.geomGeoJson) {
      await this.prisma.$executeRaw`
        UPDATE "public"."land_uses" SET geom = ST_GeomFromGeoJSON(${params.geomGeoJson}), "updatedAt" = NOW() WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.LandUseUpdateInput = {
      ...(params.type !== undefined ? { type: params.type } : {}),
      ...(params.year !== undefined ? { year: params.year } : {}),
      ...(params.areaKm2 !== undefined ? { areaKm2: params.areaKm2 } : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
      updatedAt: new Date(),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.landUse.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
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

    return this.queryOne(query, withParsedGeom);
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(lu.geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
