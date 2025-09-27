/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumberString } from 'class-validator';

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
