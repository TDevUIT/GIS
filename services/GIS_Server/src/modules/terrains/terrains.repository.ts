import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';

@Injectable()
export class TerrainsRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
      super(prisma);
    }

  private readonly selectFields = Prisma.sql`
    t.id, t.elevation, t.slope, t.soil_type as "soilType",
    t."districtId", d.name as "districtName",
    t."createdAt", t."updatedAt", ST_AsGeoJSON(t.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."terrains" t
    LEFT JOIN "public"."districts" d ON t."districtId" = d.id
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
    districtId: string;
    geomWkt: string;
    elevation?: number | null;
    slope?: number | null;
    soilType?: string | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."terrains" (id, elevation, slope, soil_type, geom, "districtId", "updatedAt")
      VALUES (
        ${params.id},
        ${params.elevation},
        ${params.slope},
        ${params.soilType},
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

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE t.id = ${id}
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    geomWkt?: string;
    elevation?: number | null;
    slope?: number | null;
    soilType?: string | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."terrains" SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW() WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.TerrainUpdateInput = {
      ...(params.elevation !== undefined ? { elevation: params.elevation } : {}),
      ...(params.slope !== undefined ? { slope: params.slope } : {}),
      ...(params.soilType !== undefined ? { soilType: params.soilType } : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.terrain.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.terrain.delete({ where: { id } });
  }

  async findTerrainAtPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(t.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async findTerrainsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(t.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.queryMany(query, withParsedGeom);
  }
}
