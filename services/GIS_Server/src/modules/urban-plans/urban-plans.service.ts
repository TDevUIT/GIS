/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUrbanPlanDto } from './dto/create-urban-plan.dto';
import { UpdateUrbanPlanDto } from './dto/update-urban-plan.dto';
import { FindUrbanPlansQueryDto } from './dto/query.dto';
import cuid from 'cuid';
import { UrbanPlansRepository } from './urban-plans.repository';

@Injectable()
export class UrbanPlansService {
  constructor(private readonly repository: UrbanPlansRepository) {}

  async create(createDto: CreateUrbanPlanDto) {
    const { districtId, geom, ...planData } = createDto;
    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    const id = cuid();

    const created = await this.repository.createRaw({
      id,
      districtId,
      planName: planData.planName,
      zoningType: planData.zoningType,
      description: planData.description,
      issuedDate: planData.issuedDate,
      geomGeoJson: geom,
    });

    if (!created) {
      throw new NotFoundException(
        `Đồ án quy hoạch với ID "${id}" không tồn tại.`,
      );
    }

    return created;
  }

  async findAll(queryDto: FindUrbanPlansQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(
        `Đồ án quy hoạch với ID "${id}" không tồn tại.`,
      );
    }
    return record;
  }

  async update(id: string, updateDto: UpdateUrbanPlanDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
    if (otherData.districtId) {
      const districtExists = await this.repository.districtExists(
        otherData.districtId,
      );
      if (!districtExists)
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
    }

    const updated = await this.repository.updateRaw({
      id,
      districtId: otherData.districtId,
      planName: otherData.planName,
      zoningType: otherData.zoningType,
      description: otherData.description,
      issuedDate: otherData.issuedDate,
      geomGeoJson: geom,
    });

    if (!updated) {
      throw new NotFoundException(
        `Đồ án quy hoạch với ID "${id}" không tồn tại.`,
      );
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findPlanAtPoint(lng: string, lat: string) {
    const plan = await this.repository.findPlanAtPoint(lng, lat);
    if (!plan) {
      throw new NotFoundException(
        `Không tìm thấy quy hoạch nào tại tọa độ (${lng}, ${lat}).`,
      );
    }
    return plan;
  }

  async findIntersecting(wkt: string) {
    return this.repository.findIntersecting(wkt);
  }
}
