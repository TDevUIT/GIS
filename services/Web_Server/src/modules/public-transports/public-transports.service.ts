/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';

type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

interface FindPublicTransportsQuery {
  districtId?: string;
  mode?: TransportMode;
}

@Injectable()
export class PublicTransportsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: any) {
    return this.gisClient.post('/public-transports', createDto);
  }

  async findAll(query: FindPublicTransportsQuery) {
    return this.gisClient.get('/public-transports', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/public-transports/${id}`);
  }

  async update(id: string, updateDto: any) {
    return this.gisClient.patch(`/public-transports/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/public-transports/${id}`);
  }

  async findIntersecting(wktBody: any) {
    return this.gisClient.post('/public-transports/intersects-with', wktBody);
  }
}
