import { Module } from '@nestjs/common';
import { AirQualitiesService } from './air-qualities.service';
import { AirQualitiesController } from './air-qualities.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [AirQualitiesController],
  providers: [AirQualitiesService],
})
export class AirQualitiesModule {}
