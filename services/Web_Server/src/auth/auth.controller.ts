/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  Get,
  Req,
  Patch,
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

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ 
    summary: 'User registration', 
    description: 'Register a new user account' 
  })
  @ApiBody({
    description: 'User registration data',
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
        phone: { type: 'string', example: '0123456789' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or email already exists' })
  async signup(
    @Body()
    body: { name: string; email: string; password: string; phone?: string },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.signup(body);
    this.setAuthCookies(res, tokens);
    return res.send({ message: 'Signup successful' });
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'User login', 
    description: 'Authenticate user and receive access tokens' 
  })
  @ApiBody({
    description: 'User login credentials',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful, tokens set in cookies' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const tokens = await this.authService.login(body);
    this.setAuthCookies(res, tokens);
    return res.send({ message: 'Login successful' });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get user profile', 
    description: 'Retrieve authenticated user profile information' 
  })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req) {
    return req.user;
  }

  @Post('refresh')
  @ApiOperation({ 
    summary: 'Refresh access token', 
    description: 'Refresh the access token using refresh token from cookies' 
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'No refresh token or invalid refresh token' })
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res.status(401).send({ message: 'No refresh token' });

    const tokens = await this.authService.refreshToken(refreshToken);
    this.setAuthCookies(res, tokens);
    return res.send({ message: 'Token refreshed' });
  }

  @Post('logout')
  @ApiOperation({ 
    summary: 'User logout', 
    description: 'Clear authentication cookies and logout user' 
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(@Res({ passthrough: true }) res: Response) {
    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: 'lax' as const,
      path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return { message: 'Logged out successfully' };
  }

  @Patch('rule')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Change user role', 
    description: 'Update user role/permissions (Admin only)' 
  })
  @ApiBody({
    description: 'User role update data',
    schema: {
      type: 'object',
      required: ['userId', 'role'],
      properties: {
        userId: { type: 'string', example: '123' },
        role: { 
          type: 'string', 
          enum: ['USER', 'ADMIN'],
          example: 'ADMIN' 
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or cannot change own role' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async rulePermissions(
    @Body() body: { userId: string; role: Role },
    @Req() req: any,
  ) {
    const { userId, role } = body;
    if (!userId || !role) {
      return { message: 'User ID and role are required' };
    }
    if (userId === req.user.id) {
      return { message: 'You cannot change your own role' };
    }
    const result = await this.authService.rulePermission(userId, role);
    return { message: result.message };
  }

  private setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const secureFlag = isProduction;

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: secureFlag,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
