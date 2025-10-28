/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  console.log('Processing service is running as a standalone worker...');
  await new Promise<void>(() => {});
}

bootstrap();
