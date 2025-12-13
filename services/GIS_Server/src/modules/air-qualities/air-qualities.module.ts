import { Module } from '@nestjs/common';
import { AirQualitiesService } from './air-qualities.service';
import { AirQualitiesController } from './air-qualities.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AirQualitiesController],
  providers: [AirQualitiesService],
  exports: [AirQualitiesService],
})
export class AirQualitiesModule {}
