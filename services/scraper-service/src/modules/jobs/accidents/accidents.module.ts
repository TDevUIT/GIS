
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { AccidentsProcessor } from './accidents.processor';
import { AccidentsScheduler } from './accidents.scheduler';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'scraper-queue',
    }),
  ],
  providers: [AccidentsProcessor, AccidentsScheduler],
})
export class AccidentsModule {}
