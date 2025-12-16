/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  OnModuleInit,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../infra/email/email.service';
import * as bcrypt from 'bcrypt';
import dayjs = require('dayjs');
import { Role } from 'generated/prisma';
import { CreateSupervisorDto } from './dto/create-supervisor.dto';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    if (!adminEmail) {
      this.logger.warn('ADMIN_EMAIL not found in .env, skipping admin seed.');
      return;
    }
    const adminExists = await this.prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (!adminExists) {
      const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
      if (!adminPassword) {
        this.logger.warn(
          'ADMIN_PASSWORD not found in .env, skipping admin seed to avoid creating an admin with an empty password.',
        );
        return;
      }

      const adminName =
        this.configService.get<string>('ADMIN_NAME') ?? 'Default Admin';
      const adminPhone = this.configService.get<string>('ADMIN_PHONE') ?? '';
      const hashedPassword: string = await bcrypt.hash(adminPassword, 10);

      await this.prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          phone: adminPhone,
          role: Role.ADMIN,
          isActive: true,
          mustChangePassword: false,
        },
      });

      this.logger.log(`Admin account for ${adminEmail} created successfully.`);
    }
  }

  async createSupervisor(dto: CreateSupervisorDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { phone: dto.phone }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already in use.');
      }
      if (existingUser.phone === dto.phone) {
        throw new ConflictException('Phone number already in use.');
      }
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(otp, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone ?? '',
        role: Role.SUPERVISOR,
        isActive: true,
        mustChangePassword: true,
      },
    });

    const dashboardUrl =
      this.configService.get<string>('CLIENT_URL') ?? 'http://localhost:3000';
    await this.emailService.sendSupervisorCredentials(
      user.email,
      otp,
      dashboardUrl,
      { name: user.name },
    );

    return {
      message:
        'Supervisor account created. An email has been sent with a temporary password (OTP).',
      userId: user.id,
    };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await bcrypt.compare(data.password, user.password))) {
      throw new UnauthorizedException('Invalid login credentials.');
    }

    if (!user.isActive) {
      throw new ForbiddenException(
        'Your account is currently inactive. Please contact an administrator.',
      );
    }

    if (user.mustChangePassword) {
      const temporaryToken = this.jwtService.sign(
        { sub: user.id },
        { expiresIn: '15m' },
      );
      return {
        message: 'First login detected. You must set a new password.',
        mustChangePassword: true,
        accessToken: temporaryToken,
      };
    }

    return this.generateTokens(user.id);
  }

  async setNewPassword(userId: string, dto: SetPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.mustChangePassword) {
      throw new ForbiddenException('Password has already been set.');
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newHashedPassword,
        mustChangePassword: false,
      },
    });

    return {
      message: 'Password has been set successfully. You can now log in.',
    };
  }

  async generateTokens(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const accessToken = this.jwtService.sign(
      { sub: userId, role: user.role },
      { expiresIn: '24h' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '7d' },
    );

    await this.prisma.token.deleteMany({ where: { userId } });

    await this.prisma.token.create({
      data: {
        refreshToken,
        userId,
        expiresAt: dayjs().add(7, 'day').toDate(),
      },
    });

    return { accessToken, refreshToken, mustChangePassword: false };
  }

  async refreshToken(refreshToken: string) {
    this.logger.debug(
      `[AuthService] Attempting to refresh with token: ${refreshToken}`,
    );

    const tokenRecord = await this.prisma.token.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      this.logger.error(`[AuthService] Refresh token not found in database.`);
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    this.logger.debug(
      `[AuthService] Found token record for user: ${tokenRecord.user.email}`,
    );

    if (dayjs(tokenRecord.expiresAt).isBefore(dayjs())) {
      this.logger.error(
        `[AuthService] Refresh token has expired. Expires at: ${tokenRecord.expiresAt}`,
      );
      await this.prisma.token.delete({ where: { id: tokenRecord.id } });
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (!tokenRecord.user.isActive) {
      this.logger.error(
        `[AuthService] User account is inactive: ${tokenRecord.user.email}`,
      );
      throw new ForbiddenException('User account is inactive.');
    }
    await this.prisma.token.delete({ where: { id: tokenRecord.id } });
    this.logger.debug(
      `[AuthService] Old token deleted. Generating new tokens...`,
    );

    return this.generateTokens(tokenRecord.userId);
  }

  async logout(refreshToken: string) {
    const token = await this.prisma.token.findUnique({
      where: { refreshToken },
    });

    if (token) {
      await this.prisma.token.delete({
        where: { refreshToken },
      });
    }

    return { message: 'Logout successful' };
  }

  async rulePermission(userId: string, role: Role) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Cannot change the role of an ADMIN user.');
    }

    if (user.role === role) {
      return { message: `User already has the role: ${role}` };
    }

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { role },
      });
      return { message: `User role updated to ${role}` };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user role.');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      this.logger.warn(
        `Password reset requested for non-existent email: ${email}`,
      );
      return {
        message:
          'If an account with this email exists, a password reset link has been sent.',
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = dayjs().add(10, 'minutes').toDate();

    await this.prisma.user.update({
      where: { email },
      data: { passwordResetToken, passwordResetExpires },
    });

    const resetUrl = `${this.configService.get('CLIENT_URL')}/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetLink(user.email, resetUrl);

    return {
      message:
        'If an account with this email exists, a password reset link has been sent.',
    };
  }

  async resetPassword(token: string, dto: SetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Password reset token is invalid or has expired.',
      );
    }

    const newHashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: newHashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        mustChangePassword: false,
      },
    });

    return { message: 'Password has been reset successfully.' };
  }
}
