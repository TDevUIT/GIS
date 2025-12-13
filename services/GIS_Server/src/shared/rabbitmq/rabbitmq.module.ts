/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module, Global } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'ui_notifications',
            type: 'fanout',
          },
        ],
        uri:
          configService.get<string>('RABBITMQ_URL') ||
          'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
        enableControllerDiscovery: true,
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class GlobalRabbitMQModule {}
