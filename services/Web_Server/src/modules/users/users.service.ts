import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      where: {
        role: Role.SUPERVISOR,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  async toggleActivation(id: string, activate: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    if (user.role === Role.ADMIN) {
      throw new ForbiddenException(
        `Cannot change activation status of an ADMIN.`,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: activate },
      select: { id: true, email: true, name: true, isActive: true },
    });

    return {
      message: `User '${updatedUser.name}' has been successfully ${
        activate ? 'activated' : 'deactivated'
      }.`,
      user: updatedUser,
    };
  }
}
