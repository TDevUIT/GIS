/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  Patch,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../generated/prisma';
import { AdminGuard } from './admin.gaurd';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('supervisor')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new supervisor account (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Supervisor account created successfully.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Admin access required.',
  })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  async createSupervisor(@Body() createSupervisorDto: CreateSupervisorDto) {
    return this.authService.createSupervisor(createSupervisorDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123 or 6-digit-OTP' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful OR must change password.',
  })
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const result = await this.authService.login(body);
    if (result.mustChangePassword) {
      return res.status(HttpStatus.OK).json(result);
    }
    if ('refreshToken' in result) {
      this.setAuthCookies(res, result);
      return res.status(HttpStatus.OK).json({ message: 'Login successful' });
    }
    return res.status(HttpStatus.OK).json(result);
  }

  @Post('set-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Set a new password on first login',
    description: 'Requires a temporary token from the first login attempt.',
  })
  @ApiResponse({ status: 200, description: 'Password set successfully.' })
  @ApiResponse({ status: 403, description: 'Password has already been set.' })
  async setPassword(@Req() req: any, @Body() setPasswordDto: SetPasswordDto) {
    const userId = req.user.id;
    return this.authService.setNewPassword(userId, setPasswordDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }
    const tokens = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, tokens);
    return res.json({ message: 'Token refreshed' });
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return { message: 'Logged out successfully' };
  }

  @Patch('role')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Change user role (Admin only)',
    description:
      'Update user role/permissions (Admin only). Cannot change ADMIN role.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId', 'role'],
      properties: {
        userId: { type: 'string', example: 'cuid-of-supervisor' },
        role: { type: 'string', enum: ['SUPERVISOR'], example: 'SUPERVISOR' },
      },
    },
  })
  async rulePermissions(
    @Body() body: { userId: string; role: Role },
    @Req() req: any,
  ) {
    if (body.userId === req.user.id) {
      throw new ForbiddenException('You cannot change your own role.');
    }
    return this.authService.rulePermission(body.userId, body.role);
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction;
    const lax = 'lax' as const;

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: lax,
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: lax,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
