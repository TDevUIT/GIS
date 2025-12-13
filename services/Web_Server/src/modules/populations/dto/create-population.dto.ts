import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

const incomeLevels = ['Thap', 'TrungBinh', 'Cao'] as const;
export type IncomeLevel = (typeof incomeLevels)[number];

const housingTypes = ['NhaRieng', 'ChungCuCaoCap', 'NhaTrongHem', 'NhaTro'] as const;
export type HousingType = (typeof housingTypes)[number];

export class CreateHouseholdDto {
  @ApiProperty({ example: 4 })
  @IsInt()
  @IsNotEmpty()
  householdSize: number;

  @ApiPropertyOptional({ enum: incomeLevels, example: 'TrungBinh' })
  @IsIn(incomeLevels)
  @IsOptional()
  incomeLevel?: IncomeLevel;

  @ApiPropertyOptional({ enum: housingTypes, example: 'NhaRieng' })
  @IsIn(housingTypes)
  @IsOptional()
  housingType?: HousingType;
}

export class CreateDemographicDto {
  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  ageMin: number;

  @ApiPropertyOptional({ example: 5 })
  @IsInt()
  @IsOptional()
  ageMax?: number;

  @ApiProperty({ example: 1200 })
  @IsInt()
  @IsNotEmpty()
  male: number;

  @ApiProperty({ example: 1300 })
  @IsInt()
  @IsNotEmpty()
  female: number;
}

export class CreatePopulationDto {
  @ApiProperty({ example: 2024 })
  @IsInt()
  @IsNotEmpty()
  year: number;

  @ApiProperty({ example: 120000 })
  @IsInt()
  @IsNotEmpty()
  populationTotal: number;

  @ApiProperty({ example: 30000 })
  @IsInt()
  @IsNotEmpty()
  householdsTotal: number;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty()
  districtId: string;

  @ApiPropertyOptional({ type: [CreateHouseholdDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHouseholdDto)
  @IsOptional()
  households?: CreateHouseholdDto[];

  @ApiPropertyOptional({ type: [CreateDemographicDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDemographicDto)
  @IsOptional()
  demographics?: CreateDemographicDto[];
}
