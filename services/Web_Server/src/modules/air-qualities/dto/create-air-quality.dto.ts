import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateAirQualityDto {
  @ApiProperty({ description: 'WKT geometry string', example: 'POINT(106.7 10.776)' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu vị trí (geom) không được để trống' })
  geom: string;

  @ApiPropertyOptional({ example: 12.5 })
  @IsNumber()
  @IsOptional()
  pm25?: number;

  @ApiPropertyOptional({ example: 420 })
  @IsNumber()
  @IsOptional()
  co2?: number;

  @ApiPropertyOptional({ example: 0.02 })
  @IsNumber()
  @IsOptional()
  no2?: number;

  @ApiProperty({ example: '2025-10-05T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty({ message: 'Thời gian đo không được để trống' })
  recordedAt: string;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
