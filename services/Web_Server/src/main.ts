import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import passport from 'passport';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
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
    .addServer('https://api.ie402.example.com', 'Production Server')
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

  app.use(cookieParser());
  app.use(passport.initialize());

  const port = 8000;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Server is running on http://localhost:${port}`);
  Logger.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
  Logger.log(`🚀 Common module (Pagination, Iterator, Response) enabled`);
}

bootstrap();
