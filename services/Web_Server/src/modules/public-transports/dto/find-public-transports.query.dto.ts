import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class FindPublicTransportsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by district ID', example: '1' })
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional({
    description: 'Filter by transport mode',
    enum: ['BUS', 'METRO', 'BRT', 'WATERWAY'],
  })
  @IsOptional()
  @IsIn(['BUS', 'METRO', 'BRT', 'WATERWAY'])
  mode?: 'BUS' | 'METRO' | 'BRT' | 'WATERWAY';
}
