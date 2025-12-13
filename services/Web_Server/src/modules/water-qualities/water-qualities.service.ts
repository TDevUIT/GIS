/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

interface FindWaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class WaterQualitiesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/water-qualities', createDto);
  }

  async findAll(query: FindWaterQualityQuery) {
    return this.gisClient.get('/water-qualities', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/water-qualities/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/water-qualities/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/water-qualities/${id}`);
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.gisClient.get('/water-qualities/within-radius', {
      params: { lng, lat, radiusInMeters },
    });
  }
}
