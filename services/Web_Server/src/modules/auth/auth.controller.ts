/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
  Logger,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import type { Response, Request, CookieOptions } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from './admin.gaurd';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RulePermissionsDto } from './dto/rule-permissions.dto';
import { Role } from 'generated/prisma';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

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
    @Body() body: LoginDto,
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
    this.logger.debug('--- Refresh Token Endpoint Hit ---');
    this.logger.debug(`Request cookies: ${JSON.stringify(req.cookies)}`);

    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      this.logger.error('No refresh token found in cookies.');
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No refresh token provided' });
    }

    this.logger.debug(`Found refresh token: ${refreshToken}`);

    try {
      const tokens = await this.authService.refreshToken(refreshToken);
      this.setAuthCookies(res, tokens);
      this.logger.debug('Token refreshed successfully.');
      return res.json({ message: 'Token refreshed' });
    } catch (error) {
      this.logger.error(`Refresh token failed: ${error.message}`);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: error.message || 'Invalid refresh token' });
    }
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

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset link' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @Post('reset-password/:token')
  @ApiOperation({ summary: 'Reset password using a token' })
  async resetPassword(
    @Param('token') token: string,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return this.authService.resetPassword(token, setPasswordDto);
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
    @Body() body: RulePermissionsDto,
    @Req() req: any,
  ) {
    if (body.userId === req.user.id) {
      throw new ForbiddenException('You cannot change your own role.');
    }
    return this.authService.rulePermission(body.userId, body.role as Role);
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
    };
    res.cookie('accessToken', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
