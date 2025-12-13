/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

interface FindUrbanPlansQuery {
  districtId?: string;
  zoningType?: string;
}

@Injectable()
export class UrbanPlansService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/urban-plans', createDto);
  }

  async findAll(query: FindUrbanPlansQuery) {
    return this.gisClient.get('/urban-plans', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/urban-plans/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/urban-plans/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/urban-plans/${id}`);
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get('/urban-plans/at-point', { params: { lng, lat } });
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/urban-plans/intersects-with', wktBody);
  }
}
