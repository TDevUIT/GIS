import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class PublicTransportsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(PublicTransportsScheduler.name);
  private readonly JOB_NAMES = [
    'simulate-network-expansion',
    'optimize-route-operations',
  ];

  constructor(
    @InjectQueue('simulation-queue') private readonly simulationQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Initializing repeatable jobs for Public Transports...');
    await this.setupRepeatableJobs();
  }

  private async setupRepeatableJobs() {
    const repeatableJobs = await this.simulationQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (this.JOB_NAMES.includes(job.name)) {
        await this.simulationQueue.removeRepeatableByKey(job.key);
      }
    }

    await this.simulationQueue.add(
      'simulate-network-expansion',
      {},
      {
        repeat: { pattern: '*/60 * * * *' },
        jobId: 'simulate-network-expansion',
      },
    );

    await this.simulationQueue.add(
      'optimize-route-operations',
      {},
      {
        repeat: { pattern: '*/30 * * * *' },
        jobId: 'optimize-route-operations',
      },
    );

    this.logger.log('Public Transports simulation jobs scheduled.');
  }
}
