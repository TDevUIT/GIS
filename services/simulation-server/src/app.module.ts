import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { HttpModule } from '@nestjs/axios';

import { AccidentsModule } from './jobs/accidents/accidents.module';
import { PopulationsModule } from './jobs/populations/populations.module';
import { EnvironmentModule } from './jobs/environment/environment.module';
import { PublicTransportsModule } from './jobs/public-transports/public-transports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 5000,
          },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      }),
    }),
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    AccidentsModule,
    PopulationsModule,
    EnvironmentModule,
    PublicTransportsModule,
  ],
})
export class AppModule {}
