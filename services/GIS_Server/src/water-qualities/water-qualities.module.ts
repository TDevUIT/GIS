import { Module } from '@nestjs/common';
import { WaterQualitiesService } from './water-qualities.service';
import { WaterQualitiesController } from './water-qualities.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WaterQualitiesController],
  providers: [WaterQualitiesService],
  exports: [WaterQualitiesService],
})
export class WaterQualitiesModule {}
