import { Module } from '@nestjs/common';
import { TrafficsService } from './traffics.service';
import { TrafficsController } from './traffics.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { TrafficsRepository } from './traffics.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TrafficsController],
  providers: [TrafficsService, TrafficsRepository],
  exports: [TrafficsService],
})
export class TrafficsModule {}
