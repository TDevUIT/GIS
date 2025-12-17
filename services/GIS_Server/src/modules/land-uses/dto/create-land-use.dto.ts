import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateLandUseDto {
  @IsString()
  @IsNotEmpty({ message: 'Land use type cannot be empty' })
  type: string;

  @IsString()
  @IsNotEmpty({ message: 'Boundary data (geom) cannot be empty' })
  geom: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Area in square kilometers cannot be empty' })
  areaKm2: number;

  @IsInt()
  @IsNotEmpty({ message: 'Year of data cannot be empty' })
  year: number;

  @IsString()
  @IsNotEmpty({ message: 'District ID cannot be empty' })
  districtId: string;
}
