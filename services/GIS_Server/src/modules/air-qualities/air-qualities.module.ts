import { Module } from '@nestjs/common';
import { AirQualitiesService } from './air-qualities.service';
import { AirQualitiesController } from './air-qualities.controller';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { AirQualitiesRepository } from './air-qualities.repository';


@Module({
  imports: [PrismaModule],
  controllers: [AirQualitiesController],
  providers: [AirQualitiesService, AirQualitiesRepository],
  exports: [AirQualitiesService],
})
export class AirQualitiesModule {}
