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
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import dayjs = require('dayjs');
import { Role } from '../../generated/prisma';
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
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use.');
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

    await this.emailService.sendSupervisorCredentials(user.email, otp);

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
    const accessToken = this.jwtService.sign(
      { sub: userId },
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
    const tokenRecord = await this.prisma.token.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || dayjs(tokenRecord.expiresAt).isBefore(dayjs())) {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    if (!tokenRecord.user.isActive) {
      throw new ForbiddenException('User account is inactive.');
    }

    await this.prisma.token.delete({ where: { id: tokenRecord.id } });

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
}
