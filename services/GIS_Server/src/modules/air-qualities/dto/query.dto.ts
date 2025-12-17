/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsDateString,
  IsString,
} from 'class-validator';

export class FindAirQualityQueryDto {
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

export class FindWithinRadiusDto {
  @IsNumberString()
  @IsNotEmpty()
  lng: string;

  @IsNumberString()
  @IsNotEmpty()
  lat: string;

  @IsNumberString()
  @IsNotEmpty()
  radiusInMeters: string;
}
