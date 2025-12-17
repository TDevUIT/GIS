/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { InfraCategory, Prisma } from '@prisma/client';
import cuid from 'cuid';
import { CloudinaryService } from '../../infra/cloudinary/cloudinary.service';
import { ImageDto } from '../../shared/dto/image.dto';
import { InfrastructuresRepository } from './infrastructures.repository';

type ImageRecord = { id: string; url: string; publicId: string };

@Injectable()
export class InfrastructuresService {
  constructor(
    private readonly repository: InfrastructuresRepository,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async create(createDto: CreateInfrastructureDto) {
    const { districtId, category, school, hospital, park, market, utility } =
      createDto;
    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    const infraId = cuid();

    switch (category) {
      case InfraCategory.SCHOOL:
        if (!school)
          throw new BadRequestException(
            'Thông tin chi tiết của trường học không được để trống.',
          );
        break;
      case InfraCategory.HOSPITAL:
        if (!hospital)
          throw new BadRequestException(
            'Thông tin chi tiết của bệnh viện không được để trống.',
          );
        break;
      case InfraCategory.PARK:
        if (!park)
          throw new BadRequestException(
            'Thông tin chi tiết của công viên không được để trống.',
          );
        break;
      case InfraCategory.MARKET:
        if (!market)
          throw new BadRequestException(
            'Thông tin chi tiết của chợ/TTTM không được để trống.',
          );
        break;
      case InfraCategory.UTILITY:
        if (!utility)
          throw new BadRequestException(
            'Thông tin chi tiết của tiện ích không được để trống.',
          );
        break;
    }

    const created = await this.repository.createWithDetails({
      infraId,
      districtId,
      name: createDto.name,
      address: createDto.address ?? null,
      category,
      geomWkt: createDto.geom,
      school: school as any,
      hospital: hospital as any,
      park: park as any,
      market: market as any,
      utility: utility as any,
    });

    if (!created) {
      throw new NotFoundException(`Hạ tầng với ID "${infraId}" không tồn tại.`);
    }

    return created;
  }

  async findAll(districtId?: string, category?: InfraCategory) {
    return this.repository.findAll(districtId, category);
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
    infraId: string,
    imagesData: ImageDto[],
  ): Promise<ImageRecord[]> {
    await this.findOne(infraId);

    const result = await this.repository.replaceImages(
      infraId,
      (imagesData || []).map((img) => ({ url: img.url, publicId: img.publicId })),
    );

    if (result.oldImages.length > 0) {
      void Promise.all(
        result.oldImages.map((img) => this.cloudinary.deleteFile(img.publicId)),
      ).catch((err) =>
        console.error('Lỗi khi xóa ảnh cũ trên Cloudinary:', err),
      );
    }

    return result.images;
  }

  async deleteImage(infraId: string, imageId: string): Promise<void> {
    const image = await this.repository.findImage(infraId, imageId);
    if (!image) {
      throw new NotFoundException(
        `Ảnh với ID "${imageId}" không tồn tại hoặc không thuộc về hạ tầng này.`,
      );
    }
    await Promise.all([
      this.repository.deleteImage(imageId),
      this.cloudinary.deleteFile(image.publicId),
    ]);
  }

  async findOne(id: string, tx?: Prisma.TransactionClient) {
    const infra = await this.repository.findOne(id, tx);

    if (!infra) {
      throw new NotFoundException(`Hạ tầng với ID "${id}" không tồn tại.`);
    }
    return infra;
  }

  async update(id: string, updateDto: UpdateInfrastructureDto) {
    const existingInfra = await this.findOne(id);
    const { geom, school, hospital, park, market, utility, ...otherData } =
      updateDto;

    const categoryToUpdate = updateDto.category || existingInfra.category;
    switch (categoryToUpdate) {
      case InfraCategory.SCHOOL:
        if (school === undefined) break;
        if (!school)
          throw new BadRequestException(
            'Thông tin chi tiết của trường học không được để trống.',
          );
        break;
      case InfraCategory.HOSPITAL:
        if (hospital === undefined) break;
        if (!hospital)
          throw new BadRequestException(
            'Thông tin chi tiết của bệnh viện không được để trống.',
          );
        break;
      case InfraCategory.PARK:
        if (park === undefined) break;
        if (!park)
          throw new BadRequestException(
            'Thông tin chi tiết của công viên không được để trống.',
          );
        break;
      case InfraCategory.MARKET:
        if (market === undefined) break;
        if (!market)
          throw new BadRequestException(
            'Thông tin chi tiết của chợ/TTTM không được để trống.',
          );
        break;
      case InfraCategory.UTILITY:
        if (utility === undefined) break;
        if (!utility)
          throw new BadRequestException(
            'Thông tin chi tiết của tiện ích không được để trống.',
          );
        break;
    }

    const updated = await this.repository.updateWithDetails({
      id,
      geomWkt: geom,
      category: updateDto.category,
      name: otherData.name,
      address: otherData.address,
      districtId: otherData.districtId,
      school: school as any,
      hospital: hospital as any,
      park: park as any,
      market: market as any,
      utility: utility as any,
    });

    if (!updated) {
      throw new NotFoundException(`Hạ tầng với ID "${id}" không tồn tại.`);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.repository.findWithinRadius(lng, lat, radiusInMeters);
  }
}
