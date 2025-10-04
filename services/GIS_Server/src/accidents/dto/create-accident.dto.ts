/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';

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
  })
  @IsString()
  @IsNotEmpty({ message: 'Severity level cannot be empty' })
  severity: string;

  @ApiPropertyOptional({
    description: 'Number of casualties in the accident',
    minimum: 0,
    example: 2,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  casualties?: number;

  @ApiProperty({
    description: 'ID of the traffic route where accident occurred',
    example: 'clxxxx1234567890',
  })
  @IsString()
  @IsNotEmpty({ message: 'Traffic route ID cannot be empty' })
  trafficId: string;
}
