/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTerrainDto } from './dto/create-terrain.dto';
import { UpdateTerrainDto } from './dto/update-terrain.dto';
import cuid from 'cuid';
import { TerrainsRepository } from './terrains.repository';

@Injectable()
export class TerrainsService {
  constructor(private readonly repository: TerrainsRepository) {}

  async create(createDto: CreateTerrainDto) {
    const { districtId, geom, ...terrainData } = createDto;
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
      geomWkt: geom,
      elevation: terrainData.elevation,
      slope: terrainData.slope,
      soilType: terrainData.soilType,
    });

    if (!created) {
      throw new NotFoundException(`Dữ liệu địa hình với ID "${id}" không tồn tại.`);
    }

    return created;
  }

  async findAll(districtId?: string) {
    return this.repository.findAll(districtId);
  }

  async findOne(id: string) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new NotFoundException(
        `Dữ liệu địa hình với ID "${id}" không tồn tại.`,
      );
    }
    return record;
  }

  async update(id: string, updateDto: UpdateTerrainDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDto;
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
      districtId: otherData.districtId,
      geomWkt: geom,
      elevation: otherData.elevation,
      slope: otherData.slope,
      soilType: otherData.soilType,
    });

    if (!updated) {
      throw new NotFoundException(
        `Dữ liệu địa hình với ID "${id}" không tồn tại.`,
      );
    }

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.remove(id);
  }

  async findTerrainAtPoint(lng: string, lat: string) {
    const terrain = await this.repository.findTerrainAtPoint(lng, lat);
    if (!terrain) {
      throw new NotFoundException(
        `Không tìm thấy dữ liệu địa hình tại tọa độ (${lng}, ${lat}).`,
      );
    }
    return terrain;
  }

  async findTerrainsIntersecting(wkt: string) {
    return this.repository.findTerrainsIntersecting(wkt);
  }
}
