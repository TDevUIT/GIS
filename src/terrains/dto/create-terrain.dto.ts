/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTerrainDto {
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @IsNumber()
  @IsOptional()
  elevation?: number;

  @IsNumber()
  @IsOptional()
  slope?: number;

  @IsString()
  @IsOptional()
  soilType?: string;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
