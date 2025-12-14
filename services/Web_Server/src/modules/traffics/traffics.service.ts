/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindTrafficsQueryDto } from './dto/find-traffics.query.dto';

@Injectable()
export class TrafficsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateTrafficDto) {
    return this.gisClient.post(GisEndpoints.traffics.base, createDto);
  }

  async findAll(query: FindTrafficsQueryDto) {
    return this.gisClient.get(GisEndpoints.traffics.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.traffics.byId(id));
  }

  async update(id: string, updateDto: UpdateTrafficDto) {
    return this.gisClient.patch(GisEndpoints.traffics.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.traffics.byId(id));
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.traffics.intersectsWith, body);
  }
}
