/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWardDto } from './dto/create-ward.dto';
import { UpdateWardDto } from './dto/update-ward.dto';
import cuid from 'cuid';
import { WardsRepository } from './wards.repository';

@Injectable()
export class WardsService {
  constructor(private readonly repository: WardsRepository) {}

  async create(createWardDto: CreateWardDto) {
    const { code, name, geom, districtId } = createWardDto;
    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `Quận với ID "${districtId}" không tồn tại.`,
      );
    }
    const id = cuid();

    const created = await this.repository.createRaw({
      id,
      code,
      name,
      geomWkt: geom,
      districtId,
    });

    if (!created) {
      throw new NotFoundException(`Phường với ID "${id}" không tồn tại.`);
    }

    return created;
  }

  async findAll(districtId?: string) {
    return this.repository.findAll(districtId);
  }

  async findOne(id: string) {
    const result = await this.repository.findOne(id);
    if (!result) {
      throw new NotFoundException(`Phường với ID "${id}" không tồn tại.`);
    }
    return result;
  }

  async update(id: string, updateWardDto: UpdateWardDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateWardDto;
    if (otherData.districtId) {
      const districtExists = await this.repository.districtExists(
        otherData.districtId,
      );
      if (!districtExists) {
        throw new BadRequestException(
          `Quận với ID "${otherData.districtId}" không tồn tại.`,
        );
      }
    }

    const updated = await this.repository.updateRaw({
      id,
      geomWkt: geom,
      code: otherData.code,
      name: otherData.name,
      districtId: otherData.districtId,
    });

    if (!updated) {
      throw new NotFoundException(`Phường với ID "${id}" không tồn tại.`);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findWardContainingPoint(lng: string, lat: string) {
    const ward = await this.repository.findWardContainingPoint(lng, lat);
    return ward ?? null;
  }

  async findWardsIntersecting(wkt: string) {
    return this.repository.findWardsIntersecting(wkt);
  }
}
