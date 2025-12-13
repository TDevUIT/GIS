/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */

import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreatePopulationDto } from './dto/create-population.dto';
import { UpdatePopulationDto } from './dto/update-population.dto';

@Injectable()
export class PopulationsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreatePopulationDto) {
    return this.gisClient.post('/populations', createDto);
  }

  async findAll(districtId?: string, year?: number) {
    const params: { districtId?: string; year?: number } = {};
    if (districtId) {
      params.districtId = districtId;
    }
    if (year !== undefined && !isNaN(year)) {
      params.year = year;
    }

    return this.gisClient.get('/populations', { params });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/populations/${id}`);
  }

  async update(id: string, updateDto: UpdatePopulationDto) {
    return this.gisClient.patch(`/populations/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/populations/${id}`);
  }
}
