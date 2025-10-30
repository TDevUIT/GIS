import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AccidentsScheduler implements OnApplicationBootstrap {
  private readonly logger = new Logger(AccidentsScheduler.name);
  private readonly JOB_NAME = 'scrape-vnexpress-accidents';

  constructor(
    @InjectQueue('scraper-queue') private readonly scraperQueue: Queue,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('🔧 Initializing repeatable jobs for Accident Scraper...');
    await this.setupRepeatableJobs();
    this.logger.log('✅ Accident Scraper job initialized successfully!');
  }

  private async setupRepeatableJobs() {
    const repeatableJobs = await this.scraperQueue.getRepeatableJobs();
    for (const job of repeatableJobs) {
      if (job.name === this.JOB_NAME) {
        await this.scraperQueue.removeRepeatableByKey(job.key);
      }
    }

    await this.scraperQueue.add(
      this.JOB_NAME,
      {},
      {
        repeat: { pattern: '*/2 * * * *' },
        jobId: this.JOB_NAME,
      },
    );

    this.logger.log(`⏰ Job "${this.JOB_NAME}" scheduled to run every 2 minutes`);
    this.logger.log(`📰 Will process 1 article per run (slow & steady crawling)`);
  }
}
