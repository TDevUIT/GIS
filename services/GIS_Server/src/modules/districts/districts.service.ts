/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { Prisma } from '@prisma/client';
import cuid from 'cuid';

@Injectable()
export class DistrictsService {
  private readonly selectFields = Prisma.sql`
    id, code, name, area_km2 as "areaKm2", density_per_km2 as "densityPerKm2",
    "createdAt", "updatedAt", ST_AsGeoJSON(geom) as geom
  `;

  private transformDistrict(district: any) {
    if (district && district.geom && typeof district.geom === 'string') {
      try {
        district.geom = JSON.parse(district.geom);
      } catch (e) {
        console.error('Failed to parse geom JSON', e);
      }
    }
    return district;
  }

  constructor(private prisma: PrismaService) {}

  async create(createDistrictDto: CreateDistrictDto) {
    const { code, name, geom, areaKm2, densityPerKm2 } = createDistrictDto;
    const id = cuid();
    const query = Prisma.sql`
      INSERT INTO "public"."districts" (id, code, name, area_km2, density_per_km2, geom, "updatedAt")
      VALUES (${id}, ${code}, ${name}, ${areaKm2}, ${densityPerKm2}, ST_GeomFromText(${geom}, 4326), NOW())
    `;
    await this.prisma.$executeRaw(query);
    return this.findOne(id);
  }

  async findAll() {
    const query = Prisma.sql`SELECT ${this.selectFields} FROM "public"."districts"`;
    const districts: any[] = await this.prisma.$queryRaw(query);
    return districts.map((d) => this.transformDistrict(d));
  }

  async findOne(id: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts" WHERE id = ${id}
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      throw new NotFoundException(`Quận với ID "${id}" không tồn tại.`);
    }
    return this.transformDistrict(result[0]);
  }

  async update(id: string, updateDistrictDto: UpdateDistrictDto) {
    await this.findOne(id);
    const { geom, ...otherData } = updateDistrictDto;
    if (Object.keys(otherData).length > 0) {
      await this.prisma.district.update({
        where: { id },
        data: otherData,
      });
    }
    if (geom) {
      await this.prisma.$executeRaw`
        UPDATE "public"."districts"
        SET geom = ST_GeomFromText(${geom}, 4326), "updatedAt" = NOW()
        WHERE id = ${id};
      `;
    }
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.district.delete({ where: { id } });
  }

  async findDistrictContainingPoint(lng: string, lat: string) {
    const searchPointWkt = `POINT(${lng} ${lat})`;
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts"
      WHERE ST_Contains(geom, ST_GeomFromText(${searchPointWkt}, 4326))
      LIMIT 1;
    `;
    const result: any[] = await this.prisma.$queryRaw(query);
    if (result.length === 0) {
      return null;
    }
    return this.transformDistrict(result[0]);
  }

  async findDistrictsIntersecting(wkt: string) {
    const query = Prisma.sql`
      SELECT ${this.selectFields} FROM "public"."districts"
      WHERE ST_Intersects(geom, ST_GeomFromText(${wkt}, 4326));
    `;
    const districts: any[] = await this.prisma.$queryRaw(query);
    return districts.map((d) => this.transformDistrict(d));
  }
}
