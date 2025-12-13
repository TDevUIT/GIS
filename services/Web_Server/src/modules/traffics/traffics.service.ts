/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

interface FindTrafficsQuery {
  districtId?: string;
  roadName?: string;
}

@Injectable()
export class TrafficsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/traffics', createDto);
  }

  async findAll(query: FindTrafficsQuery) {
    return this.gisClient.get('/traffics', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/traffics/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/traffics/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/traffics/${id}`);
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/traffics/intersects-with', wktBody);
  }
}
