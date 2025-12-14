import { Injectable } from '@nestjs/common';
import { Prisma, QualityLevel } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { FindAirQualityQueryDto } from './dto/query.dto';

@Injectable()
export class AirQualitiesRepository extends BaseRepository {
  private readonly selectFields = Prisma.sql`
    aq.id, aq.pm25, aq.co2, aq.no2, aq.level, aq.recorded_at as "recordedAt",
    aq."districtId", d.name as "districtName",
    ST_AsGeoJSON(aq.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."air_qualities" aq
    LEFT JOIN "public"."districts" d ON aq."districtId" = d.id
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
    pm25?: number | null;
    co2?: number | null;
    no2?: number | null;
    recordedAt: string;
    level: QualityLevel | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."air_qualities" (id, pm25, co2, no2, level, recorded_at, geom, "districtId")
      VALUES (
        ${params.id},
        ${params.pm25},
        ${params.co2},
        ${params.no2},
        ${params.level}::"QualityLevel",
        ${params.recordedAt}::timestamp,
        ST_GeomFromText(${params.geomWkt}, 4326),
        ${params.districtId}
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll(queryDto: FindAirQualityQueryDto) {
    const { districtId, from, to } = queryDto;
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`aq."districtId" = ${districtId}`);
    }
    if (from) {
      whereClauses.push(Prisma.sql`aq.recorded_at >= ${from}::timestamp`);
    }
    if (to) {
      whereClauses.push(Prisma.sql`aq.recorded_at <= ${to}::timestamp`);
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY aq.recorded_at DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE aq.id = ${id}`;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    geomWkt?: string;
    pm25?: number | null;
    co2?: number | null;
    no2?: number | null;
    recordedAt?: string;
    level?: QualityLevel | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."air_qualities" SET geom = ST_GeomFromText(${params.geomWkt}, 4326) WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.AirQualityUpdateInput = {
      ...(params.pm25 !== undefined ? { pm25: params.pm25 } : {}),
      ...(params.co2 !== undefined ? { co2: params.co2 } : {}),
      ...(params.no2 !== undefined ? { no2: params.no2 } : {}),
      ...(params.level !== undefined ? { level: params.level } : {}),
      ...(params.recordedAt !== undefined
        ? { recordedAt: new Date(params.recordedAt) }
        : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.airQuality.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.airQuality.delete({ where: { id } });
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    const radius = parseFloat(radiusInMeters);
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_DWithin(
        aq.geom::geography,
        ST_MakePoint(${parseFloat(lng)}, ${parseFloat(lat)})::geography,
        ${radius}
      )
      ORDER BY aq.recorded_at DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
