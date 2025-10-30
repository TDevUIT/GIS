/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ImageDto } from '../common/dto/image.dto';

@Injectable()
export class AccidentsService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

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

  async create(createDto: CreateAccidentDto) {
    const { trafficId, sourceUrl, geom, ...accidentData } = createDto as any;

    const existingAccident = await this.prisma.accident.findUnique({
      where: { sourceUrl: sourceUrl },
    });

    if (existingAccident) {
      console.log(
        `Accident from source ${sourceUrl} already exists. Skipping creation.`,
      );
      return existingAccident;
    }

    const trafficExists = await this.prisma.traffic.findUnique({
      where: { id: trafficId },
    });
    if (!trafficExists) {
      throw new BadRequestException(
        `Traffic route with ID "${trafficId}" does not exist.`,
      );
    }

    const geomString = geom
      ? `SRID=4326;POINT(${geom.coordinates[0]} ${geom.coordinates[1]})`
      : null;

    return this.prisma.accident.create({
      data: {
        ...accidentData,
        geom: geomString,
        sourceUrl: sourceUrl,
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
    const { trafficId, geom, ...accidentData } = updateDto as any;
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
    const geomString = geom
      ? `SRID=4326;POINT(${geom.coordinates[0]} ${geom.coordinates[1]})`
      : undefined;

    return this.prisma.accident.update({
      where: { id },
      data: {
        ...accidentData,
        ...(geomString !== undefined ? { geom: geomString } : {}),
        ...(trafficId && { traffic: { connect: { id: trafficId } } }),
      },
      include: this.includeOptions,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.accident.delete({ where: { id } });
  }

  async uploadImages(files: Express.Multer.File[]): Promise<ImageDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Không có file nào được tải lên.');
    }
    const uploadPromises = files.map((file) =>
      this.cloudinary.uploadFile(file).then((result) => ({
        url: result.secure_url,
        publicId: result.public_id,
      })),
    );
    return Promise.all(uploadPromises);
  }

  async setImages(accidentId: string, imagesData: ImageDto[]): Promise<any> {
    await this.findOne(accidentId);

    return this.prisma.$transaction(async (tx) => {
      const oldImages = await tx.image.findMany({ where: { accidentId } });

      if (oldImages.length > 0) {
        await tx.image.deleteMany({ where: { accidentId } });
        Promise.all(
          oldImages.map((img) => this.cloudinary.deleteFile(img.publicId)),
        ).catch((err) =>
          console.error('Lỗi khi xóa ảnh cũ trên Cloudinary:', err),
        );
      }

      if (imagesData && imagesData.length > 0) {
        await tx.image.createMany({
          data: imagesData.map((img) => ({
            url: img.url,
            publicId: img.publicId,
            accidentId: accidentId,
          })),
        });
      }

      return tx.image.findMany({ where: { accidentId } });
    });
  }

  async deleteImage(accidentId: string, imageId: string): Promise<void> {
    const image = await this.prisma.image.findFirst({
      where: { id: imageId, accidentId: accidentId },
    });
    if (!image) {
      throw new NotFoundException(
        `Ảnh với ID "${imageId}" không tồn tại hoặc không thuộc về tai nạn này.`,
      );
    }

    await Promise.all([
      this.prisma.image.delete({ where: { id: imageId } }),
      this.cloudinary.deleteFile(image.publicId),
    ]);
  }
}
