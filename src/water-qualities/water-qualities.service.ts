/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';
import { FindWaterQualityQueryDto } from './dto/query.dto';

@Injectable()
export class WaterQualitiesService {
  private readonly selectFields = Prisma.sql`
    wq.id, wq.ph, wq.turbidity, wq.contamination_index as "contaminationIndex",
    wq.recorded_at as "recordedAt", wq."districtId", d.name as "districtName",
    ST_AsGeoJSON(wq.geom) as geom
  `;
  private readonly fromTable = Prisma.sql`
    FROM "public"."water_qualities" wq
    LEFT JOIN "public"."districts" d ON wq."districtId" = d.id
  `;

  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateWaterQualityDto) {
    const { districtId, geom, ...waterQualityData } = createDto;
    const districtExists = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!districtExists) {
      throw new BadRequestException(
        `District with ID "${districtId}" does not exist.`,
      );
    }
    const id = cuid();
    const query = Prisma.sql`
      INSERT INTO "public"."water_qualities" (id, ph, turbidity, contamination_index, recorded_at, geom, "districtId")
      VALUES (
        ${id}, 
        ${waterQualityData.ph}, 
        ${waterQualityData.turbidity}, 
        ${waterQualityData.contaminationIndex}, 
        ${waterQualityData.recordedAt}::timestamp, 
        ST_GeomFromText(${geom}, 4326), 
        ${districtId}
      )
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
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
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} ${where} ORDER BY wq.recorded_at DESC`;
    return this.prisma.$queryRaw(query);
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE wq.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Water quality record with ID "${id}" not found.`,
      );
    }
    return result[0];
  }

  async update(id: string, updateDto: UpdateWaterQualityDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId },
      });
      if (!districtExists)
        throw new BadRequestException(
          `District with ID "${otherData.districtId}" does not exist.`,
        );
    }
    if (Object.keys(otherData).length > 0) {
      const dataToUpdate = { ...otherData };
      if (dataToUpdate.recordedAt) {
        dataToUpdate.recordedAt = new Date(
          dataToUpdate.recordedAt,
        ).toISOString();
      }
      await this.prisma.waterQuality.update({
        where: { id },
        data: dataToUpdate,
      });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."water_qualities" SET geom = ST_GeomFromText(${geom}, 4326) WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
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
    return this.prisma.$queryRaw(query);
  }
}
