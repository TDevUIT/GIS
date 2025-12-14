import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';

@Injectable()
export class WardsRepository extends BaseRepository {
  private readonly selectFields = Prisma.sql`
    w.id, w.code, w.name, w."districtId", d.name as "districtName",
    w."createdAt", w."updatedAt", ST_AsGeoJSON(w.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."wards" w
    LEFT JOIN "public"."districts" d ON w."districtId" = d.id
  `;

  async districtExists(districtId: string): Promise<boolean> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      select: { id: true },
    });
    return Boolean(district);
  }

  async createRaw(params: {
    id: string;
    code: string;
    name: string;
    geomWkt: string;
    districtId: string;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."wards" (id, code, name, geom, "districtId", "updatedAt")
      VALUES (
        ${params.id},
        ${params.code},
        ${params.name},
        ST_GeomFromText(${params.geomWkt}, 4326),
        ${params.districtId},
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll(districtId?: string) {
    const whereClause = districtId
      ? Prisma.sql`WHERE w."districtId" = ${districtId}`
      : Prisma.empty;

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} ${whereClause}
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE w.id = ${id}
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    geomWkt?: string;
    code?: string;
    name?: string;
    districtId?: string;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."wards" SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW() WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.WardUpdateInput = {
      ...(params.code !== undefined ? { code: params.code } : {}),
      ...(params.name !== undefined ? { name: params.name } : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.ward.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.ward.delete({ where: { id } });
  }

  async findWardContainingPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(w.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;

    return this.queryOne(query, withParsedGeom);
  }

  async findWardsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(w.geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
