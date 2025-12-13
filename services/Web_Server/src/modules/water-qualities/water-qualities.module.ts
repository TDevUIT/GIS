import { Module } from '@nestjs/common';
import { WaterQualitiesService } from './water-qualities.service';
import { WaterQualitiesController } from './water-qualities.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [WaterQualitiesController],
  providers: [WaterQualitiesService],
})
export class WaterQualitiesModule {}
