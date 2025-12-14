/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';

@Injectable()
export class TerrainsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateTerrainDto) {
    return this.gisClient.post(GisEndpoints.terrains.base, createDto);
  }

  async findAll(districtId?: string) {
    return this.gisClient.get(GisEndpoints.terrains.base, { params: { districtId } });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.terrains.byId(id));
  }

  async update(id: string, updateDto: UpdateTerrainDto) {
    return this.gisClient.patch(GisEndpoints.terrains.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.terrains.byId(id));
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get(GisEndpoints.terrains.atPoint, { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.terrains.intersectsWith, body);
  }
}
