import { Injectable } from '@nestjs/common';
import { Prisma, TransportMode } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { FindPublicTransportsQueryDto } from './dto/query.dto';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class PublicTransportsRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private readonly selectFields = Prisma.sql`
    pt.id, pt.route_name as "routeName", pt.mode, pt.capacity,
    pt.stops_count as "stopsCount", pt.frequency_min as "frequencyMin", pt.operating_hours as "operatingHours",
    pt."createdAt", pt."updatedAt",
    pt."districtId", d.name as "districtName",
    ST_AsGeoJSON(pt.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."public_transports" pt
    LEFT JOIN "public"."districts" d ON pt."districtId" = d.id
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
    routeName: string;
    mode: TransportMode;
    capacity?: number | null;
    stopsCount?: number | null;
    frequencyMin?: number | null;
    operatingHours?: string | null;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."public_transports"
        (id, route_name, mode, capacity, stops_count, frequency_min, operating_hours, geom, "districtId", "createdAt", "updatedAt")
      VALUES (
        ${params.id},
        ${params.routeName},
        ${params.mode}::"TransportMode",
        ${params.capacity},
        ${params.stopsCount},
        ${params.frequencyMin},
        ${params.operatingHours},
        ST_GeomFromText(${params.geomWkt}, 4326),
        ${params.districtId},
        NOW(),
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll(queryDto: FindPublicTransportsQueryDto) {
    const { districtId, mode } = queryDto;
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`pt."districtId" = ${districtId}`);
    }

    if (mode) {
      whereClauses.push(Prisma.sql`pt.mode = ${mode}::"TransportMode"`);
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY pt.route_name ASC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE pt.id = ${id}
    `;
    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    geomWkt?: string;
    routeName?: string;
    mode?: TransportMode;
    capacity?: number | null;
    stopsCount?: number | null;
    frequencyMin?: number | null;
    operatingHours?: string | null;
  }) {
    if (params.geomWkt) {
      await this.prisma.$executeRaw`
        UPDATE "public"."public_transports"
        SET geom = ST_GeomFromText(${params.geomWkt}, 4326), "updatedAt" = NOW()
        WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.PublicTransportUpdateInput = {
      ...(params.routeName !== undefined ? { routeName: params.routeName } : {}),
      ...(params.mode !== undefined ? { mode: params.mode } : {}),
      ...(params.capacity !== undefined ? { capacity: params.capacity } : {}),
      ...(params.stopsCount !== undefined
        ? { stopsCount: params.stopsCount }
        : {}),
      ...(params.frequencyMin !== undefined
        ? { frequencyMin: params.frequencyMin }
        : {}),
      ...(params.operatingHours !== undefined
        ? { operatingHours: params.operatingHours }
        : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
      updatedAt: new Date(),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.publicTransport.update({
        where: { id: params.id },
        data: dataToUpdate,
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.publicTransport.delete({ where: { id } });
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(pt.geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
