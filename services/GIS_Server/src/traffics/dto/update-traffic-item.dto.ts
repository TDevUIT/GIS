import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateTrafficItemDto {
  @ApiProperty({
    description: 'The ID of the traffic route',
    example: 'clxxxx1234567890',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The new simulated traffic volume',
    example: 5500,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  trafficVolume: number;
}
