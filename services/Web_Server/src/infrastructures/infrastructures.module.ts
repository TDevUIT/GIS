import { Module } from '@nestjs/common';
import { InfrastructuresService } from './infrastructures.service';
import { InfrastructuresController } from './infrastructures.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [InfrastructuresController],
  providers: [InfrastructuresService],
})
export class InfrastructuresModule {}
