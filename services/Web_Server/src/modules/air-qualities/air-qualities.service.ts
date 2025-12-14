/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateAirQualityDto } from './dto/create-air-quality.dto';
import { UpdateAirQualityDto } from './dto/update-air-quality.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindAirQualitiesQueryDto } from './dto/find-air-qualities.query.dto';

@Injectable()
export class AirQualitiesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateAirQualityDto) {
    return this.gisClient.post(GisEndpoints.airQualities.base, createDto);
  }

  async findAll(query: FindAirQualitiesQueryDto) {
    return this.gisClient.get(GisEndpoints.airQualities.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.airQualities.byId(id));
  }

  async update(id: string, updateDto: UpdateAirQualityDto) {
    return this.gisClient.patch(GisEndpoints.airQualities.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.airQualities.byId(id));
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.gisClient.get(GisEndpoints.airQualities.withinRadius, {
      params: { lng, lat, radiusInMeters },
    });
  }
}
