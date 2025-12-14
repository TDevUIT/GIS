/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateWaterQualityDto } from './dto/create-water-quality.dto';
import { UpdateWaterQualityDto } from './dto/update-water-quality.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindWaterQualitiesQueryDto } from './dto/find-water-qualities.query.dto';

@Injectable()
export class WaterQualitiesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateWaterQualityDto) {
    return this.gisClient.post(GisEndpoints.waterQualities.base, createDto);
  }

  async findAll(query: FindWaterQualitiesQueryDto) {
    return this.gisClient.get(GisEndpoints.waterQualities.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.waterQualities.byId(id));
  }

  async update(id: string, updateDto: UpdateWaterQualityDto) {
    return this.gisClient.patch(GisEndpoints.waterQualities.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.waterQualities.byId(id));
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    return this.gisClient.get(GisEndpoints.waterQualities.withinRadius, {
      params: { lng, lat, radiusInMeters },
    });
  }
}
