import { Module } from '@nestjs/common';
import { WaterQualitiesService } from './water-qualities.service';
import { WaterQualitiesController } from './water-qualities.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { WaterQualitiesRepository } from './water-qualities.repository';

@Module({
  imports: [PrismaModule],
  controllers: [WaterQualitiesController],
  providers: [WaterQualitiesService, WaterQualitiesRepository],
  exports: [WaterQualitiesService],
})
export class WaterQualitiesModule {}
