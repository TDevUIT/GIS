import { Module } from '@nestjs/common';
import { TrafficsService } from './traffics.service';
import { TrafficsController } from './traffics.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TrafficsController],
  providers: [TrafficsService],
  exports: [TrafficsService],
})
export class TrafficsModule {}
