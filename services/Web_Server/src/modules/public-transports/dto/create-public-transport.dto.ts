import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Matches,
  IsIn,
} from 'class-validator';

const transportModes = ['BUS', 'METRO', 'BRT', 'WATERWAY'] as const;
export type TransportMode = (typeof transportModes)[number];

export class CreatePublicTransportDto {
  @ApiProperty({ description: 'Tên tuyến', example: 'Tuyến Xe buýt 01' })
  @IsString()
  @IsNotEmpty({ message: 'Tên tuyến không được để trống' })
  routeName: string;

  @ApiProperty({ description: 'Loại hình vận tải', enum: transportModes, example: 'BUS' })
  @IsIn(transportModes)
  @IsNotEmpty({ message: 'Loại hình vận tải không được để trống' })
  mode: TransportMode;

  @ApiProperty({ description: 'Dữ liệu lộ trình (WKT LineString)', example: 'LINESTRING(106.7 10.7, 106.8 10.8)' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu lộ trình (geom) không được để trống' })
  geom: string;

  @ApiPropertyOptional({ description: 'Sức chứa (số hành khách)', example: 60 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  capacity?: number;

  @ApiPropertyOptional({ description: 'Số điểm dừng trên tuyến', example: 15 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stopsCount?: number;

  @ApiPropertyOptional({ description: 'Tần suất (phút/chuyến)', example: 10 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  frequencyMin?: number;

  @ApiPropertyOptional({ description: 'Giờ hoạt động', example: '05:00-22:00' })
  @IsString()
  @Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, {
    message: 'Giờ hoạt động phải có định dạng HH:mm-HH:mm',
  })
  @IsOptional()
  operatingHours?: string;

  @ApiProperty({ description: 'ID của quận', example: 'clxxxx...' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
