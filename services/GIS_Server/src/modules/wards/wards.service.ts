/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class WardsService {
  private readonly selectFields = Prisma.sql`
    w.id, w.code, w.name, w."districtId", d.name as "districtName",
    w."createdAt", w."updatedAt", ST_AsGeoJSON(w.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."wards" w
    LEFT JOIN "public"."districts" d ON w."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  private transformWard(ward: any) {
    if (ward && ward.geom && typeof ward.geom === 'string') {
      try {
        ward.geom = JSON.parse(ward.geom);
      } catch (e) {
        console.error('Failed to parse ward geom JSON string:', e);
      }
    }
    return ward;
  }

  async create(createWardDto: CreateWardDto) {
    const { code, name, geom, districtId } = createWardDto;
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
      INSERT INTO "public"."wards" (id, code, name, geom, "districtId", "updatedAt")
      VALUES (${id}, ${code}, ${name}, ST_GeomFromText(${geom}, 4326), ${districtId}, NOW())
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll(districtId?: string) {
    const whereClause = districtId
      ? Prisma.sql`WHERE w."districtId" = ${districtId}`
      : Prisma.empty;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} ${whereClause}
    `;
    const wards: any[] = await this.prisma.$queryRaw(query);
    return wards.map((ward) => this.transformWard(ward));
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable} WHERE w.id = ${id}
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(`Phường với ID "${id}" không tồn tại.`);
    }
    return this.transformWard(result[0]);
  }

  async update(id: string, updateWardDto: UpdateWardDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateWardDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists) {
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
      }
    }
    if (Object.keys(otherData).length > 0) {
      await this.prisma.ward.update({ where: { id }, data: otherData });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."wards" SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW() WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.ward.delete({ where: { id } });
  }

  async findWardContainingPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Contains(w.geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      return null;
    }
    return this.transformWard(result[0]);
  }

  async findWardsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} ${this.fromTable}
      WHERE ST_Intersects(w.geom, ST_GeomFromText(${wkt}, 4326));
    `;
    const wards: any[] = await this.prisma.$queryRaw(query);
    return wards.map((ward) => this.transformWard(ward));
  }
}
