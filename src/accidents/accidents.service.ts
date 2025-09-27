import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';

@Injectable()
export class AccidentsService {
  constructor(private prisma: PrismaService) {}

  private readonly includeOptions = {
    traffic: {
      select: {
        id: true,
        roadName: true,
      },
    },
  };

  async create(createDto: CreateAccidentDto) {
    const { trafficId, ...accidentData } = createDto;
    const trafficExists = await this.prisma.traffic.findUnique({
      where: { id: trafficId },
    });
    if (!trafficExists) {
      throw new BadRequestException(
        `Traffic route with ID "${trafficId}" does not exist.`,
      );
    }
    return this.prisma.accident.create({
      data: {
        ...accidentData,
        traffic: {
          connect: { id: trafficId },
        },
      },
      include: this.includeOptions,
    });
  }

  async findAll(trafficId?: string) {
    return this.prisma.accident.findMany({
      where: {
        trafficId,
      },
      include: this.includeOptions,
      orderBy: {
        accidentDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const accident = await this.prisma.accident.findUnique({
      where: { id },
      include: this.includeOptions,
    });
    if (!accident) {
      throw new NotFoundException(`Accident with ID "${id}" not found.`);
    }
    return accident;
  }

  async update(id: string, updateDto: UpdateAccidentDto) {
    await this.findOne(id);
    const { trafficId, ...accidentData } = updateDto;
    if (trafficId) {
      const trafficExists = await this.prisma.traffic.findUnique({
        where: { id: trafficId },
      });
      if (!trafficExists) {
        throw new BadRequestException(
          `Traffic route with ID "${trafficId}" does not exist.`,
        );
      }
    }
    return this.prisma.accident.update({
      where: { id },
      data: {
        ...accidentData,
        ...(trafficId && { traffic: { connect: { id: trafficId } } }),
      },
      include: this.includeOptions,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.accident.delete({ where: { id } });
  }
}
