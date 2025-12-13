import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateUrbanPlanDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên đồ án quy hoạch không được để trống' })
  planName: string;

  @IsString()
  @IsNotEmpty({ message: 'Loại phân khu không được để trống' })
  zoningType: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Ngày ban hành không được để trống' })
  issuedDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Dữ liệu ranh giới (geom) không được để trống' })
  geom: string;

  @IsString()
  @IsNotEmpty({ message: 'ID của quận không được để trống' })
  districtId: string;
}
