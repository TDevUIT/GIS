/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateAccidentDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Accident date cannot be empty' })
  accidentDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Severity level cannot be empty' })
  severity: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  casualties?: number;

  @IsString()
  @IsNotEmpty({ message: 'Traffic route ID cannot be empty' })
  trafficId: string;
}
