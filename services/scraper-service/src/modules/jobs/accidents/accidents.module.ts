import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { AccidentsProcessor } from './accidents.processor';
import { AccidentsScheduler } from './accidents.scheduler';
import { RabbitmqModule } from '../../common/rabbitmq/rabbitmq.module';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'scraper-queue',
    }),
    RabbitmqModule,
  ],
  providers: [AccidentsProcessor, AccidentsScheduler],
})
export class AccidentsModule {}
