/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';
import { Prisma } from '@prisma/client';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PopulationsRepository } from './populations.repository';

@Injectable()
export class PopulationsService {
  constructor(
    private readonly repository: PopulationsRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createDto: CreatePopulationDto) {
    const { districtId, year, households, demographics, ...populationData } =
      createDto;

    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }

    const recordExists = await this.repository.recordExists(districtId, year);
    if (recordExists) {
      throw new ConflictException(
        `Dữ liệu dân số cho quận ID "${districtId}" và năm "${year}" đã tồn tại.`,
      );
    }

    const result = await this.repository.createWithDetails({
      districtId,
      year,
      populationData: populationData as any,
      households: households as any,
      demographics: demographics as any,
    });

    if (!result) {
      throw new NotFoundException('Dữ liệu dân số không tồn tại.');
    }

    this.amqpConnection.publish('ui_notifications', '', {
      event: 'population.created',
      data: result,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  async findAll(districtId?: string, year?: number) {
    return this.repository.findAll(districtId, year);
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const population = await this.repository.findOne(id, tx);
    if (!population) {
      throw new NotFoundException(
        `Dữ liệu dân số với ID "${id}" không tồn tại.`,
      );
    }
    return population;
  }

  async update(id: string, updateDto: UpdatePopulationDto) {
    const { households, demographics, ...populationData } = updateDto;
    await this.findOne(id);

    const result = await this.repository.updateWithDetails({
      id,
      populationData: populationData as any,
      households: households as any,
      demographics: demographics as any,
    });

    if (!result) {
      throw new NotFoundException(
        `Dữ liệu dân số với ID "${id}" không tồn tại.`,
      );
    }

    this.amqpConnection.publish('ui_notifications', '', {
      event: 'population.updated',
      data: result,
      timestamp: new Date().toISOString(),
    });

    return result;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deleted = await this.repository.remove(id);

    this.amqpConnection.publish('ui_notifications', '', {
      event: 'population.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deleted;
  }
}
