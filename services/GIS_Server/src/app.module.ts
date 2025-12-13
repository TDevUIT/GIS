import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { CommonModule } from './shared/common.module';
import { ConfigModule } from '@nestjs/config';
import { DistrictsModule } from './modules/districts/districts.module';
import { WardsModule } from './modules/wards/wards.module';
import { InfrastructuresModule } from './modules/infrastructures/infrastructures.module';
import { PopulationsModule } from './modules/populations/populations.module';
import { TerrainsModule } from './modules/terrains/terrains.module';
import { AirQualitiesModule } from './modules/air-qualities/air-qualities.module';
import { WaterQualitiesModule } from './modules/water-qualities/water-qualities.module';
import { TrafficsModule } from './modules/traffics/traffics.module';
import { AccidentsModule } from './modules/accidents/accidents.module';
import { PublicTransportsModule } from './modules/public-transports/public-transports.module';
import { LandUsesModule } from './modules/land-uses/land-uses.module';
import { UrbanPlansModule } from './modules/urban-plans/urban-plans.module';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { GlobalRabbitMQModule } from './shared/rabbitmq/rabbitmq.module';

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
