/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateHouseholdDto {
  @IsInt()
  @IsNotEmpty()
  householdSize: number;

  @IsString()
  @IsOptional()
  incomeLevel?: string;

  @IsString()
  @IsOptional()
  housingType?: string;
}

class CreateDemographicDto {
  @IsString()
  @IsNotEmpty()
  ageGroup: string;

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
