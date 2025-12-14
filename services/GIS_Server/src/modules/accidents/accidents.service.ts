/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import { CloudinaryService } from '../../infra/cloudinary/cloudinary.service';
import { ImageDto } from '../../shared/dto/image.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AccidentsRepository } from './accidents.repository';

type ImageRecord = { id: string; url: string; publicId: string };

@Injectable()
export class AccidentsService {
  constructor(
    private readonly repository: AccidentsRepository,
    private readonly cloudinary: CloudinaryService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async create(createDto: CreateAccidentDto) {
    const { trafficId, sourceUrl, geom, ...accidentData } = createDto;

    const existingAccident = await this.repository.findBySourceUrl(sourceUrl);

    if (existingAccident) {
      console.log(
        `Accident from source ${sourceUrl} already exists. Skipping creation.`,
      );
      return existingAccident;
    }

    const trafficExists = await this.repository.trafficExists(trafficId);
    if (!trafficExists) {
      throw new BadRequestException(
        `Traffic route with ID "${trafficId}" does not exist.`,
      );
    }

    const geomString = geom
      ? `SRID=4326;POINT(${geom.coordinates[0]} ${geom.coordinates[1]})`
      : null;

    const newAccident = await this.repository.create({
      trafficId,
      sourceUrl,
      geomString,
      data: accidentData as any,
    });

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'accident.created',
      data: newAccident,
      timestamp: new Date().toISOString(),
    });

    return newAccident;
  }

  async findAll(trafficId?: string) {
    return this.repository.findAll(trafficId);
  }

  async findOne(id: string) {
    const accident = await this.repository.findOne(id);
    if (!accident) {
      throw new NotFoundException(`Accident with ID "${id}" not found.`);
    }
    return accident;
  }

  async update(id: string, updateDto: UpdateAccidentDto) {
    await this.findOne(id);
    const { trafficId, geom, ...accidentData } = updateDto;
    if (trafficId) {
      const trafficExists = await this.repository.trafficExists(trafficId);
      if (!trafficExists) {
        throw new BadRequestException(
          `Traffic route with ID "${trafficId}" does not exist.`,
        );
      }
    }
    const geomString = geom
      ? `SRID=4326;POINT(${geom.coordinates[0]} ${geom.coordinates[1]})`
      : undefined;

    const updatedAccident = await this.repository.update({
      id,
      trafficId,
      geomString,
      data: accidentData as any,
    });

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'accident.updated',
      data: updatedAccident,
      timestamp: new Date().toISOString(),
    });

    return updatedAccident;
  }

  async remove(id: string) {
    await this.findOne(id);
    const deletedAccident = await this.repository.remove(id);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'accident.deleted',
      data: { id },
      timestamp: new Date().toISOString(),
    });

    return deletedAccident;
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

  async setImages(
    accidentId: string,
    imagesData: ImageDto[],
  ): Promise<ImageRecord[]> {
    await this.findOne(accidentId);

    const result = await this.repository.replaceImages(
      accidentId,
      (imagesData || []).map((img) => ({ url: img.url, publicId: img.publicId })),
    );

    if (result.oldImages.length > 0) {
      void Promise.all(
        result.oldImages.map((img) => this.cloudinary.deleteFile(img.publicId)),
      ).catch((err) =>
        console.error('Lỗi khi xóa ảnh cũ trên Cloudinary:', err),
      );
    }

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'accident.updated',
      data: { id: accidentId, images: result.images },
      timestamp: new Date().toISOString(),
    });

    return result.images as any;
  }

  async deleteImage(accidentId: string, imageId: string): Promise<void> {
    const image = await this.repository.findImage(accidentId, imageId);
    if (!image) {
      throw new NotFoundException(
        `Ảnh với ID "${imageId}" không tồn tại hoặc không thuộc về tai nạn này.`,
      );
    }

    await Promise.all([
      this.repository.deleteImage(imageId),
      this.cloudinary.deleteFile(image.publicId),
    ]);

    void this.amqpConnection.publish('ui_notifications', '', {
      event: 'accident.updated',
      data: { id: accidentId, deletedImageId: imageId },
      timestamp: new Date().toISOString(),
    });
  }
}
