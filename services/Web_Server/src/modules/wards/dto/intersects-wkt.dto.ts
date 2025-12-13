import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IntersectsWktDto {
  @ApiProperty({ example: 'POLYGON((106.7 10.77, 106.71 10.77, 106.71 10.78, 106.7 10.78, 106.7 10.77))' })
  @IsString()
  @IsNotEmpty()
  wkt: string;
}
