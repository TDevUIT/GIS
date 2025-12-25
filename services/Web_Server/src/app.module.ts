import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './infra/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './shared/common.module';
import { EmailModule } from './infra/email/email.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { EventsModule } from './modules/events/events.module';
import { GisGatewayModule } from './modules/gis-gateway/gis-gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('REDIS_HOST') || 'localhost';
        const port = configService.get<number>('REDIS_PORT') || 6379;
        const ttl = 5 * 60 * 1000;

        try {
          const store = await redisStore({
            socket: {
              host,
              port,
            },
            ttl,
          });

          return {
            store: store as any,
            ttl,
          };
        } catch {
          return {
            ttl,
          };
        }
      },
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 8000,
      maxRedirects: 5,
    }),
    GisGatewayModule,
    EventsModule,
    CommonModule,
    PrismaModule,
    AuthModule,
    EmailModule,
    UsersModule,
  ],
})
export class AppModule {}
