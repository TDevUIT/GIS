import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { GisGatewayController } from './gis-gateway.controller';
import { GisRouteTableMiddleware } from './gis-route-table.middleware';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [GisGatewayController],
})
export class GisGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GisRouteTableMiddleware).forRoutes('*');
  }
}
