/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAirQualityDto } from './dto/create-air-quality.dto';
import { UpdateAirQualityDto } from './dto/update-air-quality.dto';
import { QualityLevel } from '@prisma/client';
import cuid from 'cuid';
import { FindAirQualityQueryDto } from './dto/query.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AirQualitiesRepository } from './air-qualities.repository';

@Injectable()
export class AirQualitiesService {
  constructor(
    private readonly repository: AirQualitiesRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private determineAirQualityLevel(pm25?: number | null): QualityLevel | null {
    if (pm25 == null) return null;
    if (pm25 <= 12.0) return QualityLevel.GOOD;
    if (pm25 <= 35.4) return QualityLevel.MODERATE;
    if (pm25 <= 55.4) return QualityLevel.UNHEALTHY;
    return QualityLevel.HAZARDOUS;
  }

  async create(createDto: CreateAirQualityDto) {
    const { districtId, geom, ...airQualityData } = createDto;
    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }

    const level = this.determineAirQualityLevel(airQualityData.pm25);
    const id = cuid();

    const newRecord = await this.repository.createRaw({
      id,
      districtId,
      geomWkt: geom,
      pm25: airQualityData.pm25,
      co2: airQualityData.co2,
      no2: airQualityData.no2,
      recordedAt: airQualityData.recordedAt,
      level,
    });

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.air_quality.created',
      data: newRecord,
      timestamp: new Date().toISOString(),
    });

    return newRecord;
  }

  async findAll(queryDto: FindAirQualityQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(
        `Bản ghi chất lượng không khí với ID "${id}" không tồn tại.`,
      );
    }
    return record;
  }

  async update(id: string, updateDto: UpdateAirQualityDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.repository.districtExists(
        otherData.districtId,
      );
      if (!districtExists)
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
    }

    const level =
      otherData.pm25 !== undefined
        ? this.determineAirQualityLevel(otherData.pm25)
        : undefined;

    const updatedRecord = await this.repository.updateRaw({
      id,
      districtId: otherData.districtId,
      geomWkt: geom,
      pm25: otherData.pm25,
      co2: otherData.co2,
      no2: otherData.no2,
      recordedAt: otherData.recordedAt,
      level,
    });

    if (!updatedRecord) {
      throw new NotFoundException(
        `Bản ghi chất lượng không khí với ID "${id}" không tồn tại.`,
      );
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.air_quality.updated',
      data: updatedRecord,
      timestamp: new Date().toISOString(),
    });

    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.repository.remove(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'environment.air_quality.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.repository.findWithinRadius(lng, lat, radiusInMeters);
  }
}
