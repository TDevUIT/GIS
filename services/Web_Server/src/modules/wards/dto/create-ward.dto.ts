import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWardDto {
  @ApiProperty({ example: 'P01' })
  @IsString({ message: 'Mã phường phải là chuỗi' })
  @IsNotEmpty({ message: 'Mã phường không được để trống' })
  code: string;

  @ApiProperty({ example: 'Phường Bến Nghé' })
  @IsString()
  @IsNotEmpty({ message: 'Tên phường không được để trống' })
  name: string;

  @ApiProperty({ description: 'WKT POLYGON/MULTIPOLYGON geometry', example: 'POLYGON((...))' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
