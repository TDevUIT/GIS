/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { Prisma, QualityLevel } from '@prisma/client';
import cuid from 'cuid';
import { FindWaterQualityQueryDto } from './dto/query.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class WaterQualitiesService {
  private readonly selectFields = Prisma.sql`
    wq.id, wq.ph, wq.turbidity, wq.contamination_index as "contaminationIndex",
    wq.level, wq.recorded_at as "recordedAt", wq."districtId", d.name as "districtName",
    ST_AsGeoJSON(wq.geom) as geom
  `;

  private readonly fromTable = Prisma.sql`
    FROM "public"."water_qualities" wq
    LEFT JOIN "public"."districts" d ON wq."districtId" = d.id
  `;

  constructor(
    private prisma: PrismaService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private determineWaterQualityLevel(
    ph?: number | null,
    turbidity?: number | null,
  ): QualityLevel | null {
    if (ph == null || turbidity == null) return null;

    if (ph < 6.0 || ph > 9.0 || turbidity > 10) {
      return QualityLevel.HAZARDOUS;
    }
    if (ph < 6.5 || ph > 8.5 || turbidity > 5) {
      return QualityLevel.UNHEALTHY;
    }
    if (turbidity > 1) {
      return QualityLevel.MODERATE;
    }
    return QualityLevel.GOOD;
  }

  private transformRecord(record: any) {
    if (record && record.geom && typeof record.geom === 'string') {
      try {
        record.geom = JSON.parse(record.geom);
      } catch (e) {
        console.error('Failed to parse geom JSON string:', e);
      }
    }
    return record;
  }

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

    const level = this.determineWaterQualityLevel(
      waterQualityData.ph,
      waterQualityData.turbidity,
    );
    const id = cuid();

    const query = Prisma.sql`
      INSERT INTO "public"."water_qualities" (id, ph, turbidity, contamination_index, level, recorded_at, geom, "districtId")
      VALUES (
        ${id},
        ${waterQualityData.ph},
        ${waterQualityData.turbidity},
        ${waterQualityData.contaminationIndex},
        ${level}::"QualityLevel",
        ${waterQualityData.recordedAt}::timestamp,
        ST_GeomFromText(${geom}, 4326),
        ${districtId}
      )
    `;
    await this.prisma.$executeRaw(query);

    const newRecord = await this.findOne(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.created',
      data: newRecord,
      timestamp: new Date().toISOString(),
    });

    return newRecord;
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
    const results: any[] = await this.prisma.$queryRaw(query);
    return results.map((record) => this.transformRecord(record));
  }

  async findOne(id: string) {
    const query = Prisma.sql`SELECT ${this.selectFields} ${this.fromTable} WHERE wq.id = ${id}`;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(
        `Water quality record with ID "${id}" not found.`,
      );
    }
    return this.transformRecord(result[0]);
  }

  async update(id: string, updateDto: UpdateWaterQualityDto) {
    const existingRecord = await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.prisma.district.findUnique({
        where: { id: otherData.districtId as string },
      });
      if (!districtExists) {
        throw new BadRequestException(
          `District with ID "${otherData.districtId}" does not exist.`,
        );
      }
    }
    if (Object.keys(otherData).length > 0) {
      const dataToUpdate: Prisma.WaterQualityUpdateInput = { ...otherData };
      const newPh =
        dataToUpdate.ph !== undefined
          ? (dataToUpdate.ph as number)
          : existingRecord.ph;
      const newTurbidity =
        dataToUpdate.turbidity !== undefined
          ? (dataToUpdate.turbidity as number)
          : existingRecord.turbidity;
      if (
        dataToUpdate.ph !== undefined ||
        dataToUpdate.turbidity !== undefined
      ) {
        dataToUpdate.level = this.determineWaterQualityLevel(
          newPh,
          newTurbidity,
        );
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

    const updatedRecord = await this.findOne(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.updated',
      data: updatedRecord,
      timestamp: new Date().toISOString(),
    });

    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.prisma.waterQuality.delete({ where: { id } });

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
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
    const results: any[] = await this.prisma.$queryRaw(query);
    return results.map((record) => this.transformRecord(record));
  }
}
