/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { GisClientService } from 'src/infra/gis-client/gis-client.service';
import { CreateUrbanPlanDto } from './dto/create-urban-plan.dto';
import { UpdateUrbanPlanDto } from './dto/update-urban-plan.dto';
import { IntersectsWktDto } from './dto/intersects-wkt.dto';
import { GisEndpoints } from 'src/infra/gis-client/gis-endpoints';
import { FindUrbanPlansQueryDto } from './dto/find-urban-plans.query.dto';

@Injectable()
export class UrbanPlansService {
  constructor(private readonly gisClient: GisClientService) {}

  async create(createDto: CreateUrbanPlanDto) {
    return this.gisClient.post(GisEndpoints.urbanPlans.base, createDto);
  }

  async findAll(query: FindUrbanPlansQueryDto) {
    return this.gisClient.get(GisEndpoints.urbanPlans.base, { params: query });
  }

  async findOne(id: string) {
    return this.gisClient.get(GisEndpoints.urbanPlans.byId(id));
  }

  async update(id: string, updateDto: UpdateUrbanPlanDto) {
    return this.gisClient.patch(GisEndpoints.urbanPlans.byId(id), updateDto);
  }

  async remove(id: string) {
    return this.gisClient.delete(GisEndpoints.urbanPlans.byId(id));
  }

  async findAtPoint(lng: string, lat: string) {
    return this.gisClient.get(GisEndpoints.urbanPlans.atPoint, { params: { lng, lat } });
  }

  async findIntersecting(body: IntersectsWktDto) {
    return this.gisClient.post(GisEndpoints.urbanPlans.intersectsWith, body);
  }
}
