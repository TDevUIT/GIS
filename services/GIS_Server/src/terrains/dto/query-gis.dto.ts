/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class QueryPointDto {
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
