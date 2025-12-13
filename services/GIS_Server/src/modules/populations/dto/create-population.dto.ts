import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HousingType, IncomeLevel } from '@prisma/client';

class CreateHouseholdDto {
  @IsInt()
  @IsNotEmpty()
  householdSize: number;

  @IsEnum(IncomeLevel)
  @IsOptional()
  incomeLevel?: IncomeLevel;

  @IsEnum(HousingType)
  @IsOptional()
  housingType?: HousingType;
}

class CreateDemographicDto {
  @IsInt()
  @IsNotEmpty()
  ageMin: number;

  @IsInt()
  @IsOptional()
  ageMax?: number;

  @IsInt()
  @IsNotEmpty()
  male: number;

  @IsInt()
  @IsNotEmpty()
  female: number;
}

export class CreatePopulationDto {
  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsInt()
  @IsNotEmpty()
  populationTotal: number;

  @IsInt()
  @IsNotEmpty()
  householdsTotal: number;

  @IsString()
  @IsNotEmpty()
  districtId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHouseholdDto)
  @IsOptional()
  households?: CreateHouseholdDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDemographicDto)
  @IsOptional()
  demographics?: CreateDemographicDto[];
}
