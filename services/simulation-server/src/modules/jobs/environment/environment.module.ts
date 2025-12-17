import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bullmq';
import { EnvironmentProcessor } from './environment.processor';
import { EnvironmentScheduler } from './environment.scheduler';

@Module({
  imports: [
    HttpModule,
    BullModule.registerQueue({
      name: 'simulation-queue',
    }),
  ],
  providers: [EnvironmentProcessor, EnvironmentScheduler],
})
export class EnvironmentModule {}
