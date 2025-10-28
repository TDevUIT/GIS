import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  app.enableShutdownHooks();
  Logger.log(
    '🚀 Scraper service is running as a standalone worker...',
    'Bootstrap',
  );
}

bootstrap();
