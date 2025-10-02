import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class HistoryQueryDto {
  @IsString()
  @IsNotEmpty()
  districtId: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}

export class LandUseSummaryQueryDto {
  @IsString()
  @IsNotEmpty()
  districtId: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year?: number;
}
