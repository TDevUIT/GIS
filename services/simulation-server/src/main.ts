import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { Queue } from 'bullmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  const simulationQueue = app.get<Queue>('BullQueue_simulation-queue');

  createBullBoard({
    queues: [new BullMQAdapter(simulationQueue, { readOnlyMode: false })],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  const port = process.env.SIMULATION_SERVER_PORT || 5001;
  await app.listen(port);

  Logger.log(`🚀 Simulation Server is running on port ${port}`, 'Bootstrap');
  Logger.log(
    `✅ BullBoard UI available at http://localhost:${port}/admin/queues`,
    'Bootstrap',
  );
}

bootstrap();
