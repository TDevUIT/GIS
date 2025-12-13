/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

interface FindLandUsesQuery {
  districtId?: string;
  type?: string;
}

@Injectable()
export class LandUsesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/land-uses', createDto);
  }

  async findAll(query: FindLandUsesQuery) {
    return this.gisClient.get('/land-uses', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/land-uses/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/land-uses/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/land-uses/${id}`);
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get('/land-uses/at-point', { params: { lng, lat } });
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/land-uses/intersects-with', wktBody);
  }
}
