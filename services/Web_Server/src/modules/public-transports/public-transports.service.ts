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

type TransportMode = 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';

interface FindPublicTransportsQuery {
  districtId?: string;
  mode?: TransportMode;
}

@Injectable()
export class PublicTransportsService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreatePublicTransportDto) {
    return this.gisClient.post('/public-transports', createDto);
  }

  async findAll(query: FindPublicTransportsQuery) {
    return this.gisClient.get('/public-transports', { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(`/public-transports/${id}`);
  }

  async update(id: string, updateDto: UpdatePublicTransportDto) {
    return this.gisClient.patch(`/public-transports/${id}`, updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(`/public-transports/${id}`);
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post('/public-transports/intersects-with', body);
  }
}
