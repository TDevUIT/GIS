import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateTrafficItemDto } from './update-traffic-item.dto';

export class BulkUpdateTrafficDto {
  @ApiProperty({
    description: 'An array of traffic route updates',
    type: [UpdateTrafficItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTrafficItemDto)
  updates: UpdateTrafficItemDto[];
}
