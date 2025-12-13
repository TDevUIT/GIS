/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

@Injectable()
export class DistrictsService {
  constructor(private readonly gisClient: GisClientService) {}

  async findAll() {
    return this.gisClient.get('/districts');
  }

  async findOne(id: string) {
    return this.gisClient.get(`/districts/${id}`);
  }

  async create(createDto: any) {
    return this.gisClient.post('/districts', createDto);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/districts/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/districts/${id}`);
  }

  async findContainingPoint(lng: string, lat: string) {
    return this.gisClient.get('/districts/contains-point', { params: { lng, lat } });
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/districts/intersects-with', wktBody);
  }

  async findWardsOfDistrict(districtId: string) {
    return this.gisClient.get(`/districts/${districtId}/wards`);
  }
}
