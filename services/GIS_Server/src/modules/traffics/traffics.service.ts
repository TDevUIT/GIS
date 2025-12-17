/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';
import { FindTrafficsQueryDto } from './dto/query.dto';
import { UpdateTrafficItemDto } from './dto/update-traffic-item.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { TrafficsRepository } from './traffics.repository';

@Injectable()
export class TrafficsService {
  constructor(
    private readonly repository: TrafficsRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createDto: CreateTrafficDto) {
    const { districtId, geom, ...trafficData } = createDto;
    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    const id = cuid();

    const newTraffic = await this.repository.createRaw({
      id,
      districtId,
      geomWkt: geom,
      roadName: trafficData.roadName,
      trafficVolume: trafficData.trafficVolume,
    });

    if (!newTraffic) {
      throw new NotFoundException(`Tuyến đường với ID "${id}" không tồn tại.`);
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'traffic.created',
      data: newTraffic,
      timestamp: new Date().toISOString(),
    });

    return newTraffic;
  }

  async findAll(queryDto: FindTrafficsQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(`Tuyến đường với ID "${id}" không tồn tại.`);
    }
    return record;
  }

  async update(id: string, updateDto: UpdateTrafficDto) {
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

    const updatedTraffic = await this.repository.updateRaw({
      id,
      districtId: otherData.districtId,
      geomWkt: geom,
      roadName: otherData.roadName,
      trafficVolume: otherData.trafficVolume,
    });

    if (!updatedTraffic) {
      throw new NotFoundException(`Tuyến đường với ID "${id}" không tồn tại.`);
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'traffic.updated',
      data: updatedTraffic,
      timestamp: new Date().toISOString(),
    });

    return updatedTraffic;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.repository.remove(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'traffic.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }

  async findTrafficsIntersecting(wkt: string) {
    return this.repository.findTrafficsIntersecting(wkt);
  }

  async findNearest(lng: number, lat: number) {
    const nearest = await this.repository.findNearest(lng, lat);
    if (!nearest) {
      throw new NotFoundException(
        `No traffic route found near location (${lng}, ${lat}).`,
      );
    }
    return nearest;
  }

  async bulkUpdate(updates: UpdateTrafficItemDto[]) {
    if (!updates || updates.length === 0) {
      throw new BadRequestException('Update data cannot be empty.');
    }

    try {
      const results = await this.repository.bulkUpdateVolumes(updates);

      void this.amqpConnection.publish('ui_notifications', '', {
        event: 'traffic.bulk_updated',
        data: {
          count: results.length,
          timestamp: new Date().toISOString(),
        },
      });

      return {
        message: `${results.length} traffic routes updated successfully.`,
        updatedCount: results.length,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `One or more traffic IDs provided for update do not exist.`,
          );
        }
      }
      throw error;
    }
  }
}
