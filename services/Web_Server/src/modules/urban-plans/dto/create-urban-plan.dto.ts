import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateUrbanPlanDto {
  @ApiProperty({ example: 'Khu đô thị mới Thủ Thiêm' })
  @IsString()
  @IsNotEmpty({ message: 'Tên đồ án quy hoạch không được để trống' })
  planName: string;

  @ApiProperty({ example: 'commercial' })
  @IsString()
  @IsNotEmpty({ message: 'Loại phân khu không được để trống' })
  zoningType: string;

  @ApiPropertyOptional({ example: 'Mô tả chi tiết...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-10-05T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày ban hành không được để trống' })
  issuedDate: string;

  @ApiProperty({ description: 'WKT POLYGON geometry', example: 'POLYGON((...))' })
  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
