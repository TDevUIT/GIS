import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
  IsUrl,
  IsObject,
  IsIn,
} from 'class-validator';

const accidentSeverities = ['LOW', 'MEDIUM', 'HIGH'] as const;
export type AccidentSeverity = (typeof accidentSeverities)[number];

export class CreateAccidentDto {
  @ApiProperty({
    description: 'Date and time when the accident occurred',
    example: '2025-10-05T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Accident date cannot be empty' })
  accidentDate: string;

  @ApiProperty({
    description: 'Severity level of the accident',
    example: 'HIGH',
    enum: accidentSeverities,
  })
  @IsIn(accidentSeverities)
  @IsNotEmpty({ message: 'Severity level cannot be empty' })
  severity: AccidentSeverity;

  @ApiPropertyOptional({
    description: 'Number of casualties in the accident',
    minimum: 0,
    example: 2,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  casualties?: number;

  @ApiPropertyOptional({ description: 'Detailed description of the accident' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'The source URL of the news article' })
  @IsUrl()
  @IsNotEmpty()
  sourceUrl: string;

  @ApiProperty({
    description: 'ID of the traffic route where accident occurred',
    example: 'clxxxx1234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'Traffic route ID cannot be empty' })
  trafficId: string;

  @ApiPropertyOptional({
    description: 'GeoJSON Point geometry for the accident location',
    example: { type: 'Point', coordinates: [106.7, 10.776] },
  })
  @IsOptional()
  @IsObject()
  geom?: { type: string; coordinates: number[] };
}
