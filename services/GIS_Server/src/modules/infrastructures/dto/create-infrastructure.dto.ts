/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  InfraCategory,
  SchoolLevel,
  HospitalType,
  MarketType,
  UtilityType,
} from '@prisma/client';

class CreateSchoolDto {
  @IsEnum(SchoolLevel)
  level: SchoolLevel;

  @IsNumber()
  @IsOptional()
  studentCapacity?: number;

  @IsNumber()
  @IsOptional()
  teacherCount?: number;
}

class CreateHospitalDto {
  @IsEnum(HospitalType)
  type: HospitalType;

  @IsNumber()
  @IsOptional()
  bedCapacity?: number;

  @IsNumber()
  @IsOptional()
  doctorCount?: number;
}

class CreateParkDto {
  @IsNumber()
  @IsOptional()
  area?: number;
}

class CreateMarketDto {
  @IsEnum(MarketType)
  type: MarketType;

  @IsNumber()
  @IsOptional()
  stallCount?: number;
}

class CreateUtilityDto {
  @IsEnum(UtilityType)
  type: UtilityType;

  @IsNumber()
  @IsOptional()
  capacity?: number;
}

export class CreateInfrastructureDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsEnum(InfraCategory)
  @IsNotEmpty()
  category: InfraCategory;

  @IsString()
  @IsNotEmpty()
  geom: string;

  @IsString()
  @IsNotEmpty()
  districtId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSchoolDto)
  school?: CreateSchoolDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHospitalDto)
  hospital?: CreateHospitalDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateParkDto)
  park?: CreateParkDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMarketDto)
  market?: CreateMarketDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUtilityDto)
  utility?: CreateUtilityDto;
}
