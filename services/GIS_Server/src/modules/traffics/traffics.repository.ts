import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { FindTrafficsQueryDto } from './dto/query.dto';
import { UpdateTrafficItemDto } from './dto/update-traffic-item.dto';

@Injectable()
export class TrafficsRepository extends BaseRepository {
  private readonly selectFields = Prisma.sql`
    t.id, t.road_name as "roadName", t.traffic_volume as "trafficVolume",
    t."updatedAt", t."districtId", d.name as "districtName",
    ST_AsGeoJSON(t.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."traffics" t
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
    roadName: string;
    trafficVolume?: number | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."traffics" (id, road_name, traffic_volume, geom, "districtId", "updatedAt")
      VALUES (
        ${params.id},
        ${params.roadName},
        ${params.trafficVolume},
        ST_GeomFromText(${params.geomWkt}, 4326),
        ${params.districtId},
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
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

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY t."updatedAt" DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE t.id = ${id}`;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    geomWkt?: string;
    roadName?: string;
    trafficVolume?: number | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."traffics" SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW() WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.TrafficUpdateInput = {
      ...(params.roadName !== undefined ? { roadName: params.roadName } : {}),
      ...(params.trafficVolume !== undefined
        ? { trafficVolume: params.trafficVolume }
        : {}),
      updatedAt: new Date(),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.traffic.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.traffic.delete({ where: { id } });
  }

  async findTrafficsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(t.geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findNearest(lng: number, lat: number) {
    const point = `SRID=4326;POINT(${lng} ${lat})`;
    const result = await this.prisma.$queryRaw<
      [{ id: string; name: string; dist: number }]
    >`
      SELECT
        id,
        "road_name" as name,
        ST_Distance(geom::geography, ${point}::geography) as dist
      FROM
        traffics
      WHERE
        ST_DWithin(geom::geography, ${point}::geography, 500)
      ORDER BY
        dist
      LIMIT 1;
    `;

    if (result && result.length > 0) {
      return result[0];
    }
    return undefined;
  }

  async bulkUpdateVolumes(updates: UpdateTrafficItemDto[]) {
    const updatePromises = updates.map((item) =>
      this.prisma.traffic.update({
        where: { id: item.id },
        data: { trafficVolume: item.trafficVolume },
      }),
    );

    return this.prisma.$transaction(updatePromises);
  }
}
