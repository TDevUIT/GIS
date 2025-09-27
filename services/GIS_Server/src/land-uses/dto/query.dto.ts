import { IsOptional, IsString } from 'class-validator';

export class FindLandUsesQueryDto {
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsString()
  @IsOptional()
  type?: string;
}
