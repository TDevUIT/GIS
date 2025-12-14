/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { FindPublicTransportsQueryDto } from './dto/query.dto';
import { TransportMode } from '@prisma/client';
import cuid from 'cuid';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PublicTransportsRepository } from './public-transports.repository';

@Injectable()
export class PublicTransportsService {
  constructor(
    private readonly repository: PublicTransportsRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createDto: CreatePublicTransportDto) {
    const { districtId, geom, ...transportData } = createDto;

    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }

    const id = cuid();

    const newRecord = await this.repository.createRaw({
      id,
      districtId,
      geomWkt: geom,
      routeName: transportData.routeName,
      mode: transportData.mode,
      capacity: transportData.capacity,
      stopsCount: transportData.stopsCount,
      frequencyMin: transportData.frequencyMin,
      operatingHours: transportData.operatingHours,
    });

    if (!newRecord) {
      throw new NotFoundException(`Tuyến GTCC với ID "${id}" không tồn tại.`);
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'public_transport.created',
      data: newRecord,
      timestamp: new Date().toISOString(),
    });

    return newRecord;
  }

  async findAll(queryDto: FindPublicTransportsQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(`Tuyến GTCC với ID "${id}" không tồn tại.`);
    }
    return record;
  }

  async update(id: string, updateDto: UpdatePublicTransportDto) {
    await this.findOne(id);

    const { geom, districtId, ...otherData } = updateDto;

    if (districtId) {
      const districtExists = await this.repository.districtExists(districtId);
      if (!districtExists) {
        throw new BadRequestException(
          `Quận với ID "${districtId}" không tồn tại.`,
        );
      }
    }

    const updatedRecord = await this.repository.updateRaw({
      id,
      geomWkt: geom,
      districtId,
      routeName: otherData.routeName,
      mode: otherData.mode as TransportMode | undefined,
      capacity: otherData.capacity,
      stopsCount: otherData.stopsCount,
      frequencyMin: otherData.frequencyMin,
      operatingHours: otherData.operatingHours,
    });

    if (!updatedRecord) {
      throw new NotFoundException(`Tuyến GTCC với ID "${id}" không tồn tại.`);
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'public_transport.updated',
      data: updatedRecord,
      timestamp: new Date().toISOString(),
    });

    return updatedRecord;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.repository.remove(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'public_transport.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }

  async findIntersecting(wkt: string) {
    return this.repository.findIntersecting(wkt);
  }
}
