/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ContainsPointDto {
  @IsNumberString()
  @IsNotEmpty()
  lng: string;

  @IsNumberString()
  @IsNotEmpty()
  lat: string;
}

export class IntersectsWktDto {
  @IsString()
  @IsNotEmpty()
  wkt: string;
}
