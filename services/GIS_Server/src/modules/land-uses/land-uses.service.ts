/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateLandUseDto } from './dto/create-land-use.dto';
import { UpdateLandUseDto } from './dto/update-land-use.dto';
import { FindLandUsesQueryDto } from './dto/query.dto';
import cuid from 'cuid';
import { LandUsesRepository } from './land-uses.repository';

@Injectable()
export class LandUsesService {
  constructor(private readonly repository: LandUsesRepository) {}

  async create(createDto: CreateLandUseDto) {
    const { districtId, year, type, geom, ...landUseData } = createDto;

    const districtExists = await this.repository.districtExists(districtId);
    if (!districtExists) {
      throw new BadRequestException(
        `District with ID "${districtId}" does not exist.`,
      );
    }

    const recordExists = await this.repository.recordExists({
      districtId,
      type,
      year,
    });
    if (recordExists) {
      throw new ConflictException(
        `Land use data for type "${type}" in district "${districtId}" for year "${year}" already exists.`,
      );
    }

    const id = cuid();

    const created = await this.repository.createRaw({
      id,
      districtId,
      type,
      year,
      areaKm2: landUseData.areaKm2,
      geomGeoJson: geom,
    });

    if (!created) {
      throw new NotFoundException(`Land use record with ID "${id}" not found.`);
    }

    return created;
  }

  async findAll(queryDto: FindLandUsesQueryDto) {
    return this.repository.findAll(queryDto);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(`Land use record with ID "${id}" not found.`);
    }
    return record;
  }

  async update(id: string, updateDto: UpdateLandUseDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;

    if (otherData.districtId) {
      const districtExists = await this.repository.districtExists(
        otherData.districtId,
      );
      if (!districtExists)
        throw new BadRequestException(
          `District with ID "${otherData.districtId}" does not exist.`,
        );
    }

    const updated = await this.repository.updateRaw({
      id,
      districtId: otherData.districtId,
      type: otherData.type,
      year: otherData.year,
      areaKm2: otherData.areaKm2,
      geomGeoJson: geom,
    });

    if (!updated) {
      throw new NotFoundException(`Land use record with ID "${id}" not found.`);
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findLandUseAtPoint(lng: string, lat: string) {
    const record = await this.repository.findLandUseAtPoint(lng, lat);
    if (!record) {
      throw new NotFoundException(
        `No land use data found at coordinate (${lng}, ${lat}).`,
      );
    }
    return record;
  }

  async findIntersecting(wkt: string) {
    return this.repository.findIntersecting(wkt);
  }
}
