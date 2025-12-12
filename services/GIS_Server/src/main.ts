import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import passport from 'passport';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  const corsOrigin = process.env.CORS_ORIGIN;
  let origin: boolean | string | RegExp | (string | RegExp)[] = true;

  if (corsOrigin) {
    if (corsOrigin === 'true') {
      origin = true;
    } else if (corsOrigin === 'false') {
      origin = false;
    } else if (corsOrigin.includes(',')) {
      origin = corsOrigin.split(',').map((o) => o.trim());
    } else {
      origin = corsOrigin;
    }
  }

  app.enableCors({
    origin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(cookieParser());
  app.use(passport.initialize());
  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('GIS Server API')
    .setDescription(
      'API documentation for GIS Server - Geographic Information System for IE402 project',
    )
    .setVersion('1.0')
    .addTag('accidents', 'Accident data management')
    .addTag('air-qualities', 'Air quality monitoring')
    .addTag('analytics', 'Data analytics and insights')
    .addTag('districts', 'District information')
    .addTag('infrastructures', 'Infrastructure data')
    .addTag('land-uses', 'Land use management')
    .addTag('populations', 'Population statistics')
    .addTag('public-transports', 'Public transport data')
    .addTag('terrains', 'Terrain information')
    .addTag('traffics', 'Traffic data')
    .addTag('urban-plans', 'Urban planning')
    .addTag('wards', 'Ward information')
    .addTag('water-qualities', 'Water quality monitoring')
    .addBearerAuth()
    .addServer('http://localhost:5000', 'Local Development Server')
    .addServer('http://api.urbanscale.online', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'GIS Server API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`🚀 GIS Server is running on http://localhost:${port}`);
  Logger.log(`📍 API prefix: http://localhost:${port}/api/v1`);
  Logger.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
