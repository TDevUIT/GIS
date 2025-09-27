/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PopulationsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreatePopulationDto) {
    const { districtId, year, households, demographics, ...populationData } =
      createDto;

    const districtExists = await this.prisma.district.findUnique({
      where: { id: districtId },
    });
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }

    const recordExists = await this.prisma.population.findUnique({
      where: { districtId_year: { districtId, year } },
    });
    if (recordExists) {
      throw new ConflictException(
        `Dữ liệu dân số cho quận ID "${districtId}" và năm "${year}" đã tồn tại.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const population = await tx.population.create({
        data: {
          ...populationData,
          year,
          district: {
            connect: { id: districtId },
          },
        },
      });

      if (households && households.length > 0) {
        await tx.household.createMany({
          data: households.map((h) => ({ ...h, populationId: population.id })),
        });
      }

      if (demographics && demographics.length > 0) {
        await tx.demographic.createMany({
          data: demographics.map((d) => ({
            ...d,
            populationId: population.id,
          })),
        });
      }

      return this.findOne(population.id, tx);
    });
  }

  async findAll(districtId?: string, year?: number) {
    return this.prisma.population.findMany({
      where: {
        districtId,
        year,
      },
      include: {
        district: {
          select: { name: true },
        },
      },
      orderBy: {
        year: 'desc',
      },
    });
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    const population = await prismaClient.population.findUnique({
      where: { id },
      include: {
        district: {
          select: { name: true, code: true },
        },
        households: true,
        demographics: true,
      },
    });

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

    return this.prisma.population.update({
      where: { id },
      data: populationData,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.population.delete({ where: { id } });
  }
}
