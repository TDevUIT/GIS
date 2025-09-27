/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTrafficDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên đường không được để trống' })
  roadName: string;

  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu tuyến đường (geom) không được để trống' })
  geom: string;

  @IsNumber()
  @IsOptional()
  trafficVolume?: number;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
