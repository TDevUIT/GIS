import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsInt } from 'class-validator';

export class CreateLandUseDto {
  @ApiProperty({ example: 'residential' })
  @IsString()
  @IsNotEmpty({ message: 'Land use type cannot be empty' })
  type: string;

  @ApiProperty({ description: 'WKT POLYGON geometry', example: 'POLYGON((...))' })
  @IsString()
  @IsNotEmpty({ message: 'Boundary data (geom) cannot be empty' })
  geom: string;

  @ApiProperty({ example: 12.5 })
  @IsNumber()
  @IsNotEmpty({ message: 'Area in square kilometers cannot be empty' })
  areaKm2: number;

  @ApiProperty({ example: 2024 })
  @IsInt()
  @IsNotEmpty({ message: 'Year of data cannot be empty' })
  year: number;

  @ApiProperty({ example: 'clxxxx1234567890' })
  @IsString()
  @IsNotEmpty({ message: 'District ID cannot be empty' })
  districtId: string;
}
