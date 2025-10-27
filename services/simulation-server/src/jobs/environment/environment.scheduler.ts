import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class EnvironmentScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(EnvironmentScheduler.name);
  private readonly JOB_NAME = 'simulate-environmental-data';

  constructor(
    @InjectQueue('simulation-queue') private readonly simulationQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Initializing repeatable jobs for Environment...');
    await this.setupRepeatableJobs();
  }

  private async setupRepeatableJobs() {
    const repeatableJobs = await this.simulationQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === this.JOB_NAME) {
        await this.simulationQueue.removeRepeatableByKey(job.key);
      }
    }

    await this.simulationQueue.add(
      this.JOB_NAME,
      {},
      {
        repeat: { pattern: '*/30 * * * *' },
        jobId: this.JOB_NAME,
      },
    );

    this.logger.log('Environment simulation job scheduled.');
  }
}
