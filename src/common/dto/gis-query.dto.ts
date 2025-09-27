import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class GisPointQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  lng: string;

  @IsNumberString()
  @IsNotEmpty()
  lat: string;
}

export class GisRadiusQueryDto extends GisPointQueryDto {
  @IsNumberString()
  @IsNotEmpty()
  radiusInMeters: string;
}
export class GisWktBodyDto {
  @IsString()
  @IsNotEmpty()
  wkt: string;
}
