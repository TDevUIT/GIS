import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../shared/repository/base.repository';
import { withParsedGeom } from '../../shared/geojson/geojson.util';
import { FindUrbanPlansQueryDto } from './dto/query.dto';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class UrbanPlansRepository extends BaseRepository {
  constructor(prisma: PrismaService) {
    super(prisma);
  }
  private readonly selectFields = Prisma.sql`
    up.id, up.plan_name as "planName", up.zoning_type as "zoningType", up.description,
    up.issued_date as "issuedDate", up."createdAt", up."updatedAt",
    up."districtId", d.name as "districtName",
    ST_AsGeoJSON(up.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."urban_plans" up
    LEFT JOIN "public"."districts" d ON up."districtId" = d.id
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
    planName: string;
    zoningType?: string;
    description?: string;
    issuedDate?: string | Date;
    geomGeoJson: string;
  }) {
    const query = Prisma.sql`
      INSERT INTO "public"."urban_plans" (id, plan_name, zoning_type, description, issued_date, geom, "districtId", "updatedAt")
      VALUES (
        ${params.id},
        ${params.planName},
        ${params.zoningType},
        ${params.description},
        ${params.issuedDate ? new Date(params.issuedDate).toISOString() : null}::timestamp,
        ST_GeomFromGeoJSON(${params.geomGeoJson}),
        ${params.districtId},
        NOW()
      )
    `;

    await this.prisma.$executeRaw(query);
    return this.findOne(params.id);
  }

  async findAll(queryDto: FindUrbanPlansQueryDto) {
    const { districtId, zoningType } = queryDto;
    const whereClauses: Prisma.Sql[] = [];

    if (districtId) {
      whereClauses.push(Prisma.sql`up."districtId" = ${districtId}`);
    }

    if (zoningType) {
      whereClauses.push(
        Prisma.sql`up.zoning_type ILIKE ${'%' + zoningType + '%'}`,
      );
    }

    const where =
      whereClauses.length > 0
        ? Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
        : Prisma.empty;

    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      ${where}
      ORDER BY up.issued_date DESC
    `;

    return this.queryMany(query, withParsedGeom);
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE up.id = ${id}
    `;

    return this.queryOne(query, withParsedGeom);
  }

  async updateRaw(params: {
    id: string;
    districtId?: string;
    planName?: string;
    zoningType?: string;
    description?: string;
    issuedDate?: string | Date;
    geomGeoJson?: string;
  }) {
    if (params.geomGeoJson) {
      await this.prisma.$executeRaw`
        UPDATE "public"."urban_plans" SET geom = ST_GeomFromGeoJSON(${params.geomGeoJson}), "updatedAt" = NOW() WHERE id = ${params.id};
      `;
    }

    const dataToUpdate: Prisma.UrbanPlanUpdateInput = {
      ...(params.planName !== undefined ? { planName: params.planName } : {}),
      ...(params.zoningType !== undefined
        ? { zoningType: params.zoningType }
        : {}),
      ...(params.description !== undefined
        ? { description: params.description }
        : {}),
      ...(params.issuedDate !== undefined
        ? { issuedDate: new Date(params.issuedDate) }
        : {}),
      ...(params.districtId !== undefined
        ? { district: { connect: { id: params.districtId } } }
        : {}),
    };

    if (Object.keys(dataToUpdate).length > 0) {
      await this.prisma.urbanPlan.update({
        where: { id: params.id },
        data: { ...dataToUpdate, updatedAt: new Date() },
      });
    }

    return this.findOne(params.id);
  }

  async remove(id: string) {
    return this.prisma.urbanPlan.delete({ where: { id } });
  }

  async findPlanAtPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(up.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      ORDER BY up.issued_date DESC
      LIMIT 1;
    `;

    return this.queryOne(query, withParsedGeom);
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(up.geom, ST_GeomFromText(${wkt}, 4326));
    `;

    return this.queryMany(query, withParsedGeom);
  }
}
