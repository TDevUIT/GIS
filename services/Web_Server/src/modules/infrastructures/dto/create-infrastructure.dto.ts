import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsOptional,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const infraCategories = [
  'SCHOOL',
  'HOSPITAL',
  'PARK',
  'MARKET',
  'UTILITY',
  'ADMINISTRATIVE',
  'OTHER',
] as const;
export type InfraCategory = (typeof infraCategories)[number];

const schoolLevels = [
  'PRESCHOOL',
  'PRIMARY',
  'SECONDARY',
  'HIGH_SCHOOL',
  'UNIVERSITY',
  'VOCATIONAL',
] as const;
export type SchoolLevel = (typeof schoolLevels)[number];

const hospitalTypes = ['GENERAL', 'SPECIALIZED', 'TRADITIONAL_MEDICINE'] as const;
export type HospitalType = (typeof hospitalTypes)[number];

const marketTypes = ['TRADITIONAL', 'SUPERMARKET', 'MALL'] as const;
export type MarketType = (typeof marketTypes)[number];

const utilityTypes = [
  'WATER_SUPPLY',
  'SEWAGE_TREATMENT',
  'WASTE_TREATMENT',
  'ELECTRICITY_SUPPLY',
  'GAS_SUPPLY',
  'INTERNET',
  'OTHER',
] as const;
export type UtilityType = (typeof utilityTypes)[number];

class CreateSchoolDto {
  @ApiProperty({ enum: schoolLevels })
  @IsIn(schoolLevels)
  level: SchoolLevel;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  studentCapacity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  teacherCount?: number;
}

class CreateHospitalDto {
  @ApiProperty({ enum: hospitalTypes })
  @IsIn(hospitalTypes)
  type: HospitalType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  bedCapacity?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  doctorCount?: number;
}

class CreateParkDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  area?: number;
}

class CreateMarketDto {
  @ApiProperty({ enum: marketTypes })
  @IsIn(marketTypes)
  type: MarketType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  stallCount?: number;
}

class CreateUtilityDto {
  @ApiProperty({ enum: utilityTypes })
  @IsIn(utilityTypes)
  type: UtilityType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  capacity?: number;
}

export class CreateInfrastructureDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ enum: infraCategories })
  @IsIn(infraCategories)
  @IsNotEmpty()
  category: InfraCategory;

  @ApiProperty({ description: 'WKT geometry string (SRID assumed by GIS server)' })
  @IsString()
  @IsNotEmpty()
  geom: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  districtId: string;

  @ApiPropertyOptional({ type: CreateSchoolDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateSchoolDto)
  school?: CreateSchoolDto;

  @ApiPropertyOptional({ type: CreateHospitalDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateHospitalDto)
  hospital?: CreateHospitalDto;

  @ApiPropertyOptional({ type: CreateParkDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateParkDto)
  park?: CreateParkDto;

  @ApiPropertyOptional({ type: CreateMarketDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateMarketDto)
  market?: CreateMarketDto;

  @ApiPropertyOptional({ type: CreateUtilityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateUtilityDto)
  utility?: CreateUtilityDto;
}
