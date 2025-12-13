/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';

@Injectable()
export class WardsService {
  constructor(private readonly gisClient: GisClientService) {}

  async findAll(districtId?: string) {
    return this.gisClient.get('/wards', { params: { districtId } });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/wards/${id}`);
  }

  async create(createDto: CreateWardDto) {
    return this.gisClient.post('/wards', createDto);
  }

  async update(id: string, updateDto: UpdateWardDto) {
    return this.gisClient.patch(`/wards/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/wards/${id}`);
  }

  async findContainingPoint(lng: string, lat: string) {
    return this.gisClient.get('/wards/contains-point', { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post('/wards/intersects-with', body);
  }
}
