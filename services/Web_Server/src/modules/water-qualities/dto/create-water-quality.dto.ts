import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateWaterQualityDto {
  @ApiProperty({ description: 'WKT geometry string', example: 'POINT(106.7 10.776)' })
  @IsString()
  @IsNotEmpty({ message: 'Location data (geom) cannot be empty' })
  geom: string;

  @ApiPropertyOptional({ example: 7.1 })
  @IsNumber()
  @IsOptional()
  ph?: number;

  @ApiPropertyOptional({ example: 1.2 })
  @IsNumber()
  @IsOptional()
  turbidity?: number;

  @ApiPropertyOptional({ example: 0.15 })
  @IsNumber()
  @IsOptional()
  contaminationIndex?: number;

  @ApiProperty({ example: '2025-10-05T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty({ message: 'Measurement time cannot be empty' })
  recordedAt: string;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'District ID cannot be empty' })
  districtId: string;
}
