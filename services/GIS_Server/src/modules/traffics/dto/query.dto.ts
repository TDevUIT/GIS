/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsOptional, IsString } from 'class-validator';
import { IntersectsWktDto } from '../../districts/dto/query-gis.dto';

export class FindTrafficsQueryDto {
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsString()
  @IsOptional()
  roadName?: string;
}

export { IntersectsWktDto };
