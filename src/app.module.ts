import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
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

@Module({
  imports: [
    PrismaModule,
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
  ],
})
export class AppModule {}
