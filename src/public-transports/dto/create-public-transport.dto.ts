import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { TransportMode } from '@prisma/client';

export class CreatePublicTransportDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên tuyến không được để trống' })
  routeName: string;

  @IsEnum(TransportMode)
  @IsNotEmpty({ message: 'Loại hình vận tải không được để trống' })
  mode: TransportMode;

  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu lộ trình (geom) không được để trống' })
  geom: string;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
