import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.gaurd';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('User Management')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard('jwt'), AdminGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all supervisor accounts (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'A list of supervisor users.',
    type: [UserResponseDto],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific supervisor account (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'The user details.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'User activated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  activate(@Param('id') id: string) {
    return this.usersService.toggleActivation(id, true);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a user account (Admin only)' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  deactivate(@Param('id') id: string) {
    return this.usersService.toggleActivation(id, false);
  }
}
