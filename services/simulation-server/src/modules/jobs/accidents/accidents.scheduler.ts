import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AccidentsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(AccidentsScheduler.name);
  private readonly JOB_NAMES = [
    'simulate-traffic-volume',
    'simulate-random-accidents',
  ];

  constructor(
    @InjectQueue('simulation-queue') private readonly simulationQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Initializing repeatable jobs for Accidents...');
    await this.setupRepeatableJobs();
  }

  private async setupRepeatableJobs() {
    const repeatableJobs = await this.simulationQueue.getRepeatableJobs();

    for (const job of repeatableJobs) {
      if (
        this.JOB_NAMES.includes(job.name) ||
        job.name === 'simulate-daily-accidents'
      ) {
        await this.simulationQueue.removeRepeatableByKey(job.key);
        this.logger.log(`Removed old repeatable job: ${job.name} (${job.id})`);
      }
    }

    await this.simulationQueue.add(
      'simulate-traffic-volume',
      {},
      {
        repeat: { pattern: '*/5 * * * *' },
        jobId: 'simulate-traffic-volume',
      },
    );

    await this.simulationQueue.add(
      'simulate-random-accidents',
      {},
      {
        repeat: { pattern: '*/2 * * * *' },
        jobId: 'simulate-random-accidents',
      },
    );

    this.logger.log(
      'Accident simulation jobs scheduled with optimized timing.',
    );
  }
}
