/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDistrictDto {
  @IsString({ message: 'Mã quận phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã quận không được để trống' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên quận không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  // Ví dụ: 'MULTIPOLYGON(((106.69 10.77, 106.70 10.77, ...)))'
  geom: string;

  @IsNumber()
  @IsOptional()
  areaKm2?: number;

  @IsNumber()
  @IsOptional()
  densityPerKm2?: number;
}
