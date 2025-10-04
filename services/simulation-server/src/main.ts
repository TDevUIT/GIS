/* eslint-disable @typescript-eslint/no-unused-vars */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  Logger.log(
    'Simulation Server is running and waiting for scheduled jobs...',
    'Bootstrap',
  );
}

bootstrap();
