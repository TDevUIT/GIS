import { IsOptional, IsString } from 'class-validator';

export class FindUrbanPlansQueryDto {
  @IsString()
  @IsOptional()
  districtId?: string;

  @IsString()
  @IsOptional()
  zoningType?: string;
}
