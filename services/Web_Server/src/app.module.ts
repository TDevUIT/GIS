import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';
import { DistrictsModule } from './modules/districts/districts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { CommonModule } from './shared/common.module';
import { EmailModule } from './infra/email/email.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { EventsModule } from './modules/events/events.module';
import { GisClientModule } from './infra/gis-client/gis-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST') || 'localhost',
            port: configService.get<number>('REDIS_PORT') || 6379,
          },
          ttl: 5 * 60 * 1000,
        });

        return {
          store: store as any,
          ttl: 5 * 60 * 1000,
        };
      },
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    GisClientModule,
    EventsModule,
    CommonModule,
    PrismaModule,
    AuthModule,
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
    EmailModule,
    UsersModule,
  ],
})
export class AppModule {}
