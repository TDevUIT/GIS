import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDistrictDto {
  @ApiProperty({ example: 'Q1' })
  @IsString({ message: 'Mã quận phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã quận không được để trống' })
  code: string;

  @ApiProperty({ example: 'Quận 1' })
  @IsString()
  @IsNotEmpty({ message: 'Tên quận không được để trống' })
  name: string;

  @ApiProperty({ description: 'WKT MULTIPOLYGON geometry', example: 'MULTIPOLYGON(((...)))' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @ApiPropertyOptional({ example: 7.72 })
  @IsNumber()
  @IsOptional()
  areaKm2?: number;

  @ApiPropertyOptional({ example: 27000 })
  @IsNumber()
  @IsOptional()
  densityPerKm2?: number;
}
