/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

@Injectable()
export class TerrainsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/terrains', createDto);
  }

  async findAll(districtId?: string) {
    return this.gisClient.get('/terrains', { params: { districtId } });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/terrains/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/terrains/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/terrains/${id}`);
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get('/terrains/at-point', { params: { lng, lat } });
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/terrains/intersects-with', wktBody);
  }
}
