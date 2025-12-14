import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindLandUsesQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '1' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({ description: 'Filter by land use type', example: 'residential' })
  @IsOptional()
  @IsString()
  type?: string;
}
