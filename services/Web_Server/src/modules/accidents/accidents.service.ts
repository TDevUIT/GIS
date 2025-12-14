/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import FormData from 'form-data';
import { CreateAccidentDto } from './dto/create-accident.dto';
import { UpdateAccidentDto } from './dto/update-accident.dto';
import type { ImageDto } from './dto/manage-images.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class AccidentsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateAccidentDto) {
    return this.gisClient.post(GisEndpoints.accidents.base, createDto);
  }

  async findAll() {
    return this.gisClient.get(GisEndpoints.accidents.base);
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.accidents.byId(id));
  }

  async update(id: string, updateDto: UpdateAccidentDto) {
    return this.gisClient.patch(GisEndpoints.accidents.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.accidents.byId(id));
  }

  async uploadImages(files: UploadFile[]) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file.buffer, file.originalname);
    });
    return this.gisClient.post(GisEndpoints.accidents.upload, formData, {
      headers: { ...formData.getHeaders() },
    });
  }

  async setImages(accidentId: string, imagesData: ImageDto[]) {
    return this.gisClient.post(GisEndpoints.accidents.images(accidentId), { images: imagesData });
  }

  async deleteImage(accidentId: string, imageId: string) {
    return this.gisClient.delete(
      GisEndpoints.accidents.imageById(accidentId, imageId),
    );
  }
}
