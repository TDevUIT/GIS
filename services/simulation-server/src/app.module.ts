import { Module } from '@nestjs/common';
import { AccidentsModule } from './jobs/accidents/accidents.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { PopulationsModule } from './jobs/populations/populations.module';
import { EnvironmentModule } from './jobs/environment/environment.module';
import { PublicTransportsModule } from './jobs/public-transports.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    AccidentsModule,
    PopulationsModule,
    EnvironmentModule,
    PublicTransportsModule,
  ],
})
export class AppModule {}
