/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindLandUsesQueryDto } from './dto/find-land-uses.query.dto';

@Injectable()
export class LandUsesService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateLandUseDto) {
    return this.gisClient.post(GisEndpoints.landUses.base, createDto);
  }

  async findAll(query: FindLandUsesQueryDto) {
    return this.gisClient.get(GisEndpoints.landUses.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.landUses.byId(id));
  }

  async update(id: string, updateDto: UpdateLandUseDto) {
    return this.gisClient.patch(GisEndpoints.landUses.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.landUses.byId(id));
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get(GisEndpoints.landUses.atPoint, { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.landUses.intersectsWith, body);
  }
}
