import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { BaseRepository } from '../../shared/repository/base.repository';

@Injectable()
export class PopulationsRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async districtExists(districtId: string): Promise<boolean> {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
      select: { id: true },
    });
    return Boolean(district);
  }

  async recordExists(districtId: string, year: number): Promise<boolean> {
    const record = await this.prisma.population.findUnique({
      where: { districtId_year: { districtId, year } },
      select: { id: true },
    });
    return Boolean(record);
  }

  async createWithDetails(params: {
    districtId: string;
    year: number;
    populationData: Omit<Prisma.PopulationCreateInput, 'district' | 'households' | 'demographics'>;
    households?: Prisma.HouseholdCreateManyInput[];
    demographics?: Prisma.DemographicCreateManyInput[];
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        const population = await tx.population.create({
          data: {
            ...params.populationData,
            year: params.year,
            district: { connect: { id: params.districtId } },
          },
        });

        if (params.households && params.households.length > 0) {
          await tx.household.createMany({
            data: params.households.map((h) => ({ ...h, populationId: population.id })),
          });
        }

        if (params.demographics && params.demographics.length > 0) {
          await tx.demographic.createMany({
            data: params.demographics.map((d) => ({ ...d, populationId: population.id })),
          });
        }

        return this.findOne(population.id, tx);
      },
      { timeout: 30000 },
    );
  }

  async findAll(districtId?: string, year?: number) {
    return this.prisma.population.findMany({
      where: { districtId, year },
      include: { district: { select: { name: true } } },
      orderBy: [{ year: 'desc' }, { district: { name: 'asc' } }],
    });
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    return prismaClient.population.findUnique({
      where: { id },
      include: {
        district: { select: { name: true, code: true } },
        households: true,
        demographics: true,
      },
    });
  }

  async updateWithDetails(params: {
    id: string;
    populationData: Prisma.PopulationUpdateInput;
    households?: Prisma.HouseholdCreateManyInput[];
    demographics?: Prisma.DemographicCreateManyInput[];
  }) {
    return this.prisma.$transaction(
      async (tx) => {
        await tx.population.update({
          where: { id: params.id },
          data: params.populationData,
        });

        if (params.demographics) {
          await tx.demographic.deleteMany({ where: { populationId: params.id } });
          if (params.demographics.length > 0) {
            await tx.demographic.createMany({
              data: params.demographics.map((d) => ({ ...d, populationId: params.id })),
            });
          }
        }

        if (params.households) {
          await tx.household.deleteMany({ where: { populationId: params.id } });
          if (params.households.length > 0) {
            await tx.household.createMany({
              data: params.households.map((h) => ({ ...h, populationId: params.id })),
            });
          }
        }

        return this.findOne(params.id, tx);
      },
      { timeout: 30000 },
    );
  }

  async remove(id: string) {
    return this.prisma.population.delete({ where: { id } });
  }
}
