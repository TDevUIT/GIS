/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class CreateAirQualityDto {
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu vị trí (geom) không được để trống' })
  geom: string;

  @IsNumber()
  @IsOptional()
  pm25?: number;

  @IsNumber()
  @IsOptional()
  co2?: number;

  @IsNumber()
  @IsOptional()
  no2?: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Thời gian đo không được để trống' })
  recordedAt: string;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
