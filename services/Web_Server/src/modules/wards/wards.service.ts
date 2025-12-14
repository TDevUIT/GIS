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
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';

@Injectable()
export class WardsService {
  constructor(private readonly gisClient: GisClientService) {}

  async findAll(districtId?: string) {
    return this.gisClient.get(GisEndpoints.wards.base, { params: { districtId } });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.wards.byId(id));
  }

  async create(createDto: CreateWardDto) {
    return this.gisClient.post(GisEndpoints.wards.base, createDto);
  }

  async update(id: string, updateDto: UpdateWardDto) {
    return this.gisClient.patch(GisEndpoints.wards.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.wards.byId(id));
  }

  async findContainingPoint(lng: string, lat: string) {
    return this.gisClient.get(GisEndpoints.wards.containsPoint, { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.wards.intersectsWith, body);
  }
}
