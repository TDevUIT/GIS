import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';

export class FindAirQualitiesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '1' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  to?: string;
}
