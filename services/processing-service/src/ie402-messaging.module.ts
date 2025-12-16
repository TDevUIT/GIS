import { Module, Global } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        exchanges: [
          {
            name: 'amq.topic',
            type: 'topic',
          },
        ],
        uri:
          configService.get<string>('RABBITMQ_URL') ||
          'amqp://guest:guest@localhost:5672',
        connectionInitOptions: { wait: false },
        enableControllerDiscovery:
          configService.get<string>('ENABLE_RMQ_CONTROLLER_DISCOVERY') === 'true',
      }),
    }),
  ],
  exports: [RabbitMQModule],
})
export class Ie402MessagingModule {}
