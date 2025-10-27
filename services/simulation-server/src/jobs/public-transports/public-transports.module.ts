import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { PublicTransportsProcessor } from './public-transports.processor';
import { PublicTransportsScheduler } from './public-transports.scheduler';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'simulation-queue',
    }),
  ],
  providers: [PublicTransportsProcessor, PublicTransportsScheduler],
})
export class PublicTransportsModule {}
