/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateTrafficDto } from './dto/create-traffic.dto';
import { UpdateTrafficDto } from './dto/update-traffic.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';

interface FindTrafficsQuery {
  districtId?: string;
  roadName?: string;
}

@Injectable()
export class TrafficsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateTrafficDto) {
    return this.gisClient.post('/traffics', createDto);
  }

  async findAll(query: FindTrafficsQuery) {
    return this.gisClient.get('/traffics', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/traffics/${id}`);
  }

  async update(id: string, updateDto: UpdateTrafficDto) {
    return this.gisClient.patch(`/traffics/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/traffics/${id}`);
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post('/traffics/intersects-with', body);
  }
}
