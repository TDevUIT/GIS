import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTerrainDto {
  @ApiProperty({ description: 'WKT geometry', example: 'POLYGON((...))' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @ApiPropertyOptional({ example: 12.3 })
  @IsNumber()
  @IsOptional()
  elevation?: number;

  @ApiPropertyOptional({ example: 5.6 })
  @IsNumber()
  @IsOptional()
  slope?: number;

  @ApiPropertyOptional({ example: 'alluvial' })
  @IsString()
  @IsOptional()
  soilType?: string;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
