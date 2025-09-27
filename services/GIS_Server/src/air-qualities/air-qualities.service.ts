/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAirQualityDto } from './dto/create-air-quality.dto';
import { UpdateAirQualityDto } from './dto/update-air-quality.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';
import { FindAirQualityQueryDto } from './dto/query.dto';

@Injectable()
export class AirQualitiesService {
  private readonly selectFields = Prisma.sql`
    aq.id, aq.pm25, aq.co2, aq.no2, aq.recorded_at as "recordedAt",
    aq."districtId", d.name as "districtName",
    ST_AsGeoJSON(aq.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."air_qualities" aq
    LEFT JOIN "public"."districts" d ON aq."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateAirQualityDto) {
    const { districtId, geom, ...airQualityData } = createDto;
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
      INSERT INTO "public"."air_qualities" (id, pm25, co2, no2, recorded_at, geom, "districtId")
      VALUES (${id}, ${airQualityData.pm25}, ${airQualityData.co2}, ${airQualityData.no2}, ${airQualityData.recordedAt}::timestamp, ST_GeomFromText(${geom}, 4326), ${districtId})
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll(queryDto: FindAirQualityQueryDto) {
    const { districtId, from, to } = queryDto;
    const whereClauses: string[] = [];
    const params: any[] = [];
    if (districtId) {
      whereClauses.push(`aq."districtId" = $${params.length + 1}`);
      params.push(districtId);
    }
    if (from) {
      whereClauses.push(`aq.recorded_at >= $${params.length + 1}::timestamp`);
      params.push(from);
    }
    if (to) {
      whereClauses.push(`aq.recorded_at <= $${params.length + 1}::timestamp`);
      params.push(to);
    }
    const where =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    const query = `
      SELECT aq.id, aq.pm25, aq.co2, aq.no2, aq.recorded_at as "recordedAt",
        aq."districtId", d.name as "districtName",
        ST_AsGeoJSON(aq.geom) as geom
      FROM "public"."air_qualities" aq
      LEFT JOIN "public"."districts" d ON aq."districtId" = d.id
      ${where}
      ORDER BY aq.recorded_at DESC
    `;
    return this.prisma.$queryRawUnsafe(query, ...params);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE aq.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Bản ghi chất lượng không khí với ID "${id}" không tồn tại.`,
      );
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateAirQualityDto) {
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
      const dataToUpdate = { ...otherData };
      if (dataToUpdate.recordedAt) {
        dataToUpdate.recordedAt = new Date(
          dataToUpdate.recordedAt,
        ).toISOString();
      }
      await this.prisma.airQuality.update({
        where: { id },
        data: dataToUpdate,
      });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."air_qualities" SET geom = ST_GeomFromText(${geom}, 4326) WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
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
    return this.prisma.$queryRaw(query);
  }
}
