import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { DistrictsModule } from './districts/districts.module';
import { WardsModule } from './wards/wards.module';
import { InfrastructuresModule } from './infrastructures/infrastructures.module';
import { PopulationsModule } from './populations/populations.module';
import { TerrainsModule } from './terrains/terrains.module';
import { AirQualitiesModule } from './air-qualities/air-qualities.module';
import { WaterQualitiesModule } from './water-qualities/water-qualities.module';
import { TrafficsModule } from './traffics/traffics.module';
import { AccidentsModule } from './accidents/accidents.module';
import { PublicTransportsModule } from './public-transports/public-transports.module';
import { LandUsesModule } from './land-uses/land-uses.module';
import { UrbanPlansModule } from './urban-plans/urban-plans.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GlobalRabbitMQModule } from './common/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GlobalRabbitMQModule,
    CommonModule,
    PrismaModule,
    CloudinaryModule,
    DistrictsModule,
    WardsModule,
    InfrastructuresModule,
    PopulationsModule,
    TerrainsModule,
    AirQualitiesModule,
    WaterQualitiesModule,
    TrafficsModule,
    AccidentsModule,
    PublicTransportsModule,
    LandUsesModule,
    UrbanPlansModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
