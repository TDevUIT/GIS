/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';

@Injectable()
export class DistrictsService {
  constructor(private readonly gisClient: GisClientService) {}

  async findAll() {
    return this.gisClient.get(GisEndpoints.districts.base);
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.districts.byId(id));
  }

  async create(createDto: CreateDistrictDto) {
    return this.gisClient.post(GisEndpoints.districts.base, createDto);
  }

  async update(id: string, updateDto: UpdateDistrictDto) {
    return this.gisClient.patch(GisEndpoints.districts.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.districts.byId(id));
  }

  async findContainingPoint(lng: string, lat: string) {
    return this.gisClient.get(GisEndpoints.districts.containsPoint, { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.districts.intersectsWith, body);
  }

  async findWardsOfDistrict(districtId: string) {
    return this.gisClient.get(GisEndpoints.districts.wardsOfDistrict(districtId));
  }
}
