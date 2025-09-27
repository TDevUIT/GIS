/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @IsString({ message: 'Mã phường phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã phường không được để trống' })
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên phường không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
