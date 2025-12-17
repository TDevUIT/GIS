import { Module } from '@nestjs/common';
import { InfrastructuresService } from './infrastructures.service';
import { InfrastructuresController } from './infrastructures.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { CloudinaryModule } from '../../infra/cloudinary/cloudinary.module';
import { InfrastructuresRepository } from './infrastructures.repository';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [InfrastructuresController],
  providers: [InfrastructuresService, InfrastructuresRepository],
  exports: [InfrastructuresService],
})
export class InfrastructuresModule {}
