import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import passport from 'passport';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { requestIdMiddleware } from './shared/middlewares/request-id.middleware';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const corsOriginEnv = process.env.CORS_ORIGIN ?? '';
  const corsOrigins = corsOriginEnv
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const corsCredentials = (process.env.CORS_CREDENTIALS ?? '').toLowerCase() === 'true';
  const corsMaxAge = process.env.CORS_MAX_AGE ? Number(process.env.CORS_MAX_AGE) : undefined;
  console.log(corsOriginEnv)
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (corsOrigins.length === 0 || corsOrigins.includes(origin) || corsOrigins.includes('*')) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: corsCredentials,
    maxAge: corsMaxAge,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(cookieParser());
  app.use(passport.initialize());
  app.use(requestIdMiddleware);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(reflector),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('IE402 Web Server API')
    .setDescription(
      'API documentation for IE402 GIS Web Server - Urban Planning and Analytics System',
    )
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Districts', 'District management endpoints')
    .addTag('Wards', 'Ward management endpoints')
    .addTag('Infrastructures', 'Infrastructure data management')
    .addTag('Populations', 'Population statistics and demographics')
    .addTag('Terrains', 'Terrain and topography data')
    .addTag('Air Quality', 'Air quality monitoring data')
    .addTag('Water Quality', 'Water quality monitoring data')
    .addTag('Traffic', 'Traffic data and analysis')
    .addTag('Accidents', 'Traffic accident records')
    .addTag('Public Transport', 'Public transportation data')
    .addTag('Land Use', 'Land use planning and zoning')
    .addTag('Urban Plans', 'Urban development plans')
    .addTag('Analytics', 'Data analytics and insights')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:8000', 'Local Development Server')
    .addServer('http://api.urbanscale.online', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'IE402 API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is running on http://localhost:${port}`);
  Logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  Logger.log(`🚀 Common module (Pagination, Iterator, Response) enabled`);
}

bootstrap();
