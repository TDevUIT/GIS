import { Injectable } from '@nestjs/common';
import { Prisma, QualityLevel } from '@prisma/client';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { BaseRepository } from '../../shared/repository/base.repository';
import { FindWaterQualityQueryDto } from './dto/query.dto';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class WaterQualitiesRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  private readonly selectFields = Prisma.sql`
    wq.id, wq.ph, wq.turbidity, wq.contamination_index as "contaminationIndex",
    wq.level, wq.recorded_at as "recordedAt", wq."districtId", d.name as "districtName",
    ST_AsGeoJSON(wq.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."water_qualities" wq
    LEFT JOIN "public"."districts" d ON wq."districtId" = d.id
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
    ph?: number | null;
    turbidity?: number | null;
    contaminationIndex?: number | null;
    recordedAt: string;
    level: QualityLevel | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."water_qualities" (id, ph, turbidity, contamination_index, level, recorded_at, geom, "districtId")
      VALUES (
        ${params.id},
        ${params.ph},
        ${params.turbidity},
        ${params.contaminationIndex},
        ${params.level}::"QualityLevel",
        ${params.recordedAt}::timestamp,
        ST_GeomFromText(${params.geomWkt}, 4326),
        ${params.districtId}
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll(queryDto: FindWaterQualityQueryDto) {
    const { districtId, from, to } = queryDto;
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`wq."districtId" = ${districtId}`);
    }
    if (from) {
      whereClauses.push(Prisma.sql`wq.recorded_at >= ${from}::timestamp`);
    }
    if (to) {
      whereClauses.push(Prisma.sql`wq.recorded_at <= ${to}::timestamp`);
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY wq.recorded_at DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE wq.id = ${id}`;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    geomWkt?: string;
    ph?: number | null;
    turbidity?: number | null;
    contaminationIndex?: number | null;
    recordedAt?: string;
    level?: QualityLevel | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."water_qualities" SET geom = ST_GeomFromText(${params.geomWkt}, 4326) WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.WaterQualityUpdateInput = {
      ...(params.ph !== undefined ? { ph: params.ph } : {}),
      ...(params.turbidity !== undefined ? { turbidity: params.turbidity } : {}),
      ...(params.contaminationIndex !== undefined
        ? { contaminationIndex: params.contaminationIndex }
        : {}),
      ...(params.level !== undefined ? { level: params.level } : {}),
      ...(params.recordedAt !== undefined
        ? { recordedAt: new Date(params.recordedAt) }
        : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.waterQuality.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.waterQuality.delete({ where: { id } });
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    const radius = parseFloat(radiusInMeters);
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_DWithin(
        wq.geom::geography,
        ST_MakePoint(${parseFloat(lng)}, ${parseFloat(lat)})::geography,
        ${radius}
      )
      ORDER BY wq.recorded_at DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
