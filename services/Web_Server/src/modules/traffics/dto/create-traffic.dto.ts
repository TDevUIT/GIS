import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateTrafficDto {
  @ApiProperty({ example: 'Nguyen Hue Street' })
  @IsString()
  @IsNotEmpty({ message: 'Tên đường không được để trống' })
  roadName: string;

  @ApiProperty({ description: 'WKT LINESTRING geometry', example: 'LINESTRING(106.7 10.77, 106.71 10.78)' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu tuyến đường (geom) không được để trống' })
  geom: string;

  @ApiPropertyOptional({ example: 1.2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  lengthKm?: number;

  @ApiPropertyOptional({ example: 1200 })
  @IsNumber()
  @IsOptional()
  trafficVolume?: number;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
