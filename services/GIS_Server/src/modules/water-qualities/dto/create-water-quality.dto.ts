/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateWaterQualityDto {
  @IsString()
  @IsNotEmpty({ message: 'Location data (geom) cannot be empty' })
  geom: string;

  @IsNumber()
  @IsOptional()
  ph?: number;

  @IsNumber()
  @IsOptional()
  turbidity?: number;

  @IsNumber()
  @IsOptional()
  contaminationIndex?: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Measurement time cannot be empty' })
  recordedAt: string;

  @IsString()
  @IsNotEmpty({ message: 'District ID cannot be empty' })
  districtId: string;
}
