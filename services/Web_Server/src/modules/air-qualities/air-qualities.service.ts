/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

interface FindAirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}

@Injectable()
export class AirQualitiesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/air-qualities', createDto);
  }

  async findAll(query: FindAirQualityQuery) {
    return this.gisClient.get('/air-qualities', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/air-qualities/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/air-qualities/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/air-qualities/${id}`);
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.gisClient.get('/air-qualities/within-radius', {
      params: { lng, lat, radiusInMeters },
    });
  }
}
