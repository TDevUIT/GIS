import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSupervisorDto {
  @ApiProperty({ example: 'supervisor@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'John Supervisor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsString()
  phone: string;
}
