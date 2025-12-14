import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';

@Injectable()
export class DistrictsRepository extends BaseRepository {
  private readonly selectFields = Prisma.sql`
    id, code, name, area_km2 as "areaKm2", density_per_km2 as "densityPerKm2",
    "createdAt", "updatedAt", ST_AsGeoJSON(geom) as geom
  `;

  async createRaw(params: {
    id: string;
    code: string;
    name: string;
    geomWkt: string;
    areaKm2?: number | null;
    densityPerKm2?: number | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."districts" (id, code, name, area_km2, density_per_km2, geom, "updatedAt")
      VALUES (
        ${params.id},
        ${params.code},
        ${params.name},
        ${params.areaKm2},
        ${params.densityPerKm2},
        ST_GeomFromText(${params.geomWkt}, 4326),
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll() {
    const query = Prisma.sql`SELECT ${this.selectFields} FROM "public"."districts"`;
    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts" WHERE id = ${id}
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    geomWkt?: string;
    code?: string;
    name?: string;
    areaKm2?: number | null;
    densityPerKm2?: number | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."districts"
        SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW()
        WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.DistrictUpdateInput = {
      ...(params.code !== undefined ? { code: params.code } : {}),
      ...(params.name !== undefined ? { name: params.name } : {}),
      ...(params.areaKm2 !== undefined ? { areaKm2: params.areaKm2 } : {}),
      ...(params.densityPerKm2 !== undefined
        ? { densityPerKm2: params.densityPerKm2 }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.district.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.district.delete({ where: { id } });
  }

  async findDistrictContainingPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts"
      WHERE ST_Contains(geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async findDistrictsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts"
      WHERE ST_Intersects(geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
