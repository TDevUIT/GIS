import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TransportMode } from '@prisma/client';

export class FindPublicTransportsQueryDto {
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsEnum(TransportMode)
  @IsOptional()
  mode?: TransportMode;
}
