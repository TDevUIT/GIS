import { Module } from '@nestjs/common';
import { TrafficsService } from './traffics.service';
import { TrafficsController } from './traffics.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [TrafficsController],
  providers: [TrafficsService],
})
export class TrafficsModule {}
