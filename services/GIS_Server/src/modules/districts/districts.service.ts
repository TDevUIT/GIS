/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import cuid from 'cuid';
import { DistrictsRepository } from './districts.repository';

@Injectable()
export class DistrictsService {
  constructor(private readonly repository: DistrictsRepository) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const { code, name, geom, areaKm2, densityPerKm2 } = createDistrictDto;
    const id = cuid();

    const created = await this.repository.createRaw({
      id,
      code,
      name,
      geomWkt: geom,
      areaKm2,
      densityPerKm2,
    });

    if (!created) {
      throw new NotFoundException(`Quận với ID "${id}" không tồn tại.`);
    }

    return created;
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const result = await this.repository.findOne(id);
    if (!result) {
      throw new NotFoundException(`Quận với ID "${id}" không tồn tại.`);
    }
    return result;
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDistrictDto;

    const updated = await this.repository.updateRaw({
      id,
      geomWkt: geom,
      code: otherData.code,
      name: otherData.name,
      areaKm2: otherData.areaKm2,
      densityPerKm2: otherData.densityPerKm2,
    });

    if (!updated) {
      throw new NotFoundException(`Quận với ID "${id}" không tồn tại.`);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findDistrictContainingPoint(lng: string, lat: string) {
    const district = await this.repository.findDistrictContainingPoint(lng, lat);
    return district ?? null;
  }

  async findDistrictsIntersecting(wkt: string) {
    return this.repository.findDistrictsIntersecting(wkt);
  }
}
