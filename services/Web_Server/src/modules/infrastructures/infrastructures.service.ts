/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import FormData from 'form-data';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import type { ImageDto } from './dto/manage-images.dto';

type InfraCategory =
  | 'SCHOOL'
  | 'HOSPITAL'
  | 'PARK'
  | 'MARKET'
  | 'UTILITY'
  | 'ADMINISTRATIVE'
  | 'OTHER';

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class InfrastructuresService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateInfrastructureDto) {
    return this.gisClient.post('/infrastructures', createDto);
  }

  async findAll(districtId?: string, category?: InfraCategory) {
    return this.gisClient.get('/infrastructures', {
      params: { districtId, category },
    });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/infrastructures/${id}`);
  }

  async update(id: string, updateDto: UpdateInfrastructureDto) {
    return this.gisClient.patch(`/infrastructures/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/infrastructures/${id}`);
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.gisClient.get('/infrastructures/within-radius', {
      params: { lng, lat, radiusInMeters },
    });
  }

  async uploadImages(files: UploadFile[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file.buffer, {
        filename: file.originalname as string,
        contentType: file.mimetype as string,
      });
    });
    return this.gisClient.post('/infrastructures/upload', formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
  }

  async setImages(infraId: string, imagesData: ImageDto[]) {
    return this.gisClient.post(`/infrastructures/${infraId}/images`, { images: imagesData });
  }

  async deleteImage(infraId: string, imageId: string) {
    return this.gisClient.delete(
      `/infrastructures/${infraId}/images/${imageId}`,
    );
  }
}
