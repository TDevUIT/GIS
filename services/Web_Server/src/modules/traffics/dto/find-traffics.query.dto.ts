import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindTrafficsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '1' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Filter by road name', example: 'Nguyen Hue Street' })
  @IsOptional()
  @IsString()
  roadName?: string;
}
