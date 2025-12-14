/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreatePublicTransportDto } from './dto/create-public-transport.dto';
import { UpdatePublicTransportDto } from './dto/update-public-transport.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindPublicTransportsQueryDto } from './dto/find-public-transports.query.dto';

@Injectable()
export class PublicTransportsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreatePublicTransportDto) {
    return this.gisClient.post(GisEndpoints.publicTransports.base, createDto);
  }

  async findAll(query: FindPublicTransportsQueryDto) {
    return this.gisClient.get(GisEndpoints.publicTransports.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.publicTransports.byId(id));
  }

  async update(id: string, updateDto: UpdatePublicTransportDto) {
    return this.gisClient.patch(GisEndpoints.publicTransports.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.publicTransports.byId(id));
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.publicTransports.intersectsWith, body);
  }
}
