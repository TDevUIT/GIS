import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindUrbanPlansQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '1' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Filter by zoning type', example: 'commercial' })
  @IsOptional()
  @IsString()
  zoningType?: string;
}
