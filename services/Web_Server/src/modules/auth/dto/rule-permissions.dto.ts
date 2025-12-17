import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const allowedRoles = ['SUPERVISOR'] as const;

export class RulePermissionsDto {
  @ApiProperty({ example: 'cuid-of-supervisor' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ enum: allowedRoles, example: 'SUPERVISOR' })
  @IsIn(allowedRoles)
  role: (typeof allowedRoles)[number];
}
