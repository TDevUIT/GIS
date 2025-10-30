import { IsNumber, IsLongitude, IsLatitude } from 'class-validator';

export class FindByLocationDto {
  @IsNumber()
  @IsLongitude()
  lng: number;

  @IsNumber()
  @IsLatitude()
  lat: number;
}
