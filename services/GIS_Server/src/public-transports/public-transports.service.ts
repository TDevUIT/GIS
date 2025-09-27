/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { FindPublicTransportsQueryDto } from './dto/query.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class PublicTransportsService {
  private readonly selectFields = Prisma.sql`
    pt.id, pt.route_name as "routeName", pt.mode, pt.capacity,
    pt."districtId", d.name as "districtName",
    ST_AsGeoJSON(pt.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."public_transports" pt
    LEFT JOIN "public"."districts" d ON pt."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePublicTransportDto) {
    const { districtId, geom, ...transportData } = createDto;
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
      INSERT INTO "public"."public_transports" (id, route_name, mode, capacity, geom, "districtId")
      VALUES (${id}, ${transportData.routeName}, ${transportData.mode}::"TransportMode", ${transportData.capacity}, ST_GeomFromText(${geom}, 4326), ${districtId})
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
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
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} ${where} ORDER BY pt.route_name ASC`;
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE pt.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(`Tuyến GTCC với ID "${id}" không tồn tại.`);
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdatePublicTransportDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists)
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
    }
    if (Object.keys(otherData).length > 0) {
      await this.prisma.publicTransport.update({
        where: { id },
        data: otherData,
      });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."public_transports" SET geom = ST_GeomFromText(${geom}, 4326) WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.publicTransport.delete({ where: { id } });
  }

  async findIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(pt.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    return this.prisma.$queryRaw(query);
  }
}
