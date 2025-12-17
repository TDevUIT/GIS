import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { BaseRepository } from '../../shared/repository/base.repository';

@Injectable()
export class AccidentsRepository extends BaseRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  private readonly includeOptions = {
    traffic: {
      select: {
        id: true,
        roadName: true,
      },
    },
    images: {
      select: { id: true, url: true, publicId: true },
      orderBy: { createdAt: 'asc' as const },
    },
  } as const;

  async trafficExists(trafficId: string): Promise<boolean> {
    const traffic = await this.prisma.traffic.findUnique({
      where: { id: trafficId },
      select: { id: true },
    });
    return Boolean(traffic);
  }

  async findBySourceUrl(sourceUrl: string) {
    return this.prisma.accident.findUnique({
      where: { sourceUrl },
    });
  }

  async create(params: {
    trafficId: string;
    sourceUrl: string;
    geomString: string | null;
    data: Omit<Prisma.AccidentCreateInput, 'traffic'>;
  }) {
    return this.prisma.accident.create({
      data: {
        ...params.data,
        geom: params.geomString,
        sourceUrl: params.sourceUrl,
        traffic: { connect: { id: params.trafficId } },
      },
      include: this.includeOptions,
    });
  }

  async findAll(trafficId?: string) {
    return this.prisma.accident.findMany({
      where: { trafficId },
      include: this.includeOptions,
      orderBy: { accidentDate: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.accident.findUnique({
      where: { id },
      include: this.includeOptions,
    });
  }

  async update(params: {
    id: string;
    trafficId?: string;
    geomString?: string;
    data: Prisma.AccidentUpdateInput;
  }) {
    return this.prisma.accident.update({
      where: { id: params.id },
      data: {
        ...params.data,
        ...(params.geomString !== undefined ? { geom: params.geomString } : {}),
        ...(params.trafficId ? { traffic: { connect: { id: params.trafficId } } } : {}),
      },
      include: this.includeOptions,
    });
  }

  async remove(id: string) {
    return this.prisma.accident.delete({ where: { id } });
  }

  async findImages(accidentId: string, tx?: Prisma.TransactionClient) {
    const prismaClient = tx || this.prisma;
    return prismaClient.image.findMany({
      where: { accidentId },
      select: { id: true, url: true, publicId: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async replaceImages(accidentId: string, imagesData: Array<{ url: string; publicId: string }>) {
    return this.prisma.$transaction(async (tx) => {
      const oldImages = await this.findImages(accidentId, tx);

      if (oldImages.length > 0) {
        await tx.image.deleteMany({ where: { accidentId } });
      }

      if (imagesData.length > 0) {
        await tx.image.createMany({
          data: imagesData.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            accidentId,
          })),
        });
      }

      const images = await this.findImages(accidentId, tx);
      return { oldImages, images };
    });
  }

  async findImage(accidentId: string, imageId: string) {
    return this.prisma.image.findFirst({
      where: { id: imageId, accidentId },
      select: { id: true, url: true, publicId: true },
    });
  }

  async deleteImage(imageId: string) {
    return this.prisma.image.delete({ where: { id: imageId } });
  }
}
