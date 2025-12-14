/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { QualityLevel } from '@prisma/client';
import cuid from 'cuid';
import { FindWaterQualityQueryDto } from './dto/query.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { WaterQualitiesRepository } from './water-qualities.repository';

@Injectable()
export class WaterQualitiesService {
  constructor(
    private readonly repository: WaterQualitiesRepository,
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

  async create(createDto: CreateWaterQualityDto) {
    const { districtId, geom, ...waterQualityData } = createDto;
    const districtExists = await this.repository.districtExists(districtId);
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

    const newRecord = await this.repository.createRaw({
      id,
      districtId,
      geomWkt: geom,
      ph: waterQualityData.ph,
      turbidity: waterQualityData.turbidity,
      contaminationIndex: waterQualityData.contaminationIndex,
      recordedAt: waterQualityData.recordedAt,
      level,
    });

    if (!newRecord) {
      throw new NotFoundException(
        `Water quality record with ID "${id}" not found.`,
      );
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.created',
      data: newRecord,
      timestamp: new Date().toISOString(),
    });

    return newRecord;
  }

  async findAll(queryDto: FindWaterQualityQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(
        `Water quality record with ID "${id}" not found.`,
      );
    }
    return record;
  }

  async update(id: string, updateDto: UpdateWaterQualityDto) {
    const existingRecord = await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.repository.districtExists(
        otherData.districtId,
      );
      if (!districtExists) {
        throw new BadRequestException(
          `District with ID "${otherData.districtId}" does not exist.`,
        );
      }
    }

    const existingPh =
      typeof existingRecord.ph === 'number' || existingRecord.ph === null
        ? existingRecord.ph
        : undefined;
    const existingTurbidity =
      typeof existingRecord.turbidity === 'number' ||
      existingRecord.turbidity === null
        ? existingRecord.turbidity
        : undefined;

    const newPh = otherData.ph !== undefined ? otherData.ph : existingPh;
    const newTurbidity =
      otherData.turbidity !== undefined ? otherData.turbidity : existingTurbidity;

    const level =
      otherData.ph !== undefined || otherData.turbidity !== undefined
        ? this.determineWaterQualityLevel(newPh, newTurbidity)
        : undefined;

    const updatedRecord = await this.repository.updateRaw({
      id,
      districtId: otherData.districtId,
      geomWkt: geom,
      ph: otherData.ph,
      turbidity: otherData.turbidity,
      contaminationIndex: otherData.contaminationIndex,
      recordedAt: otherData.recordedAt,
      level,
    });

    if (!updatedRecord) {
      throw new NotFoundException(
        `Water quality record with ID "${id}" not found.`,
      );
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.updated',
      data: updatedRecord,
      timestamp: new Date().toISOString(),
    });

    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.repository.remove(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.water_quality.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.repository.findWithinRadius(lng, lat, radiusInMeters);
  }
}
