import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { PopulationsProcessor } from './populations.processor';
import { PopulationsScheduler } from './populations.scheduler';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'simulation-queue',
    }),
  ],
  providers: [PopulationsProcessor, PopulationsScheduler],
})
export class PopulationsModule {}
