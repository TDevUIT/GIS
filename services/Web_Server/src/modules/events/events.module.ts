import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventsGateway } from './events.gateway';
import { NotificationConsumer } from './notification.consumer';

@Global()
@Module({
  imports:
    process.env.ENABLE_RABBITMQ === 'false'
      ? []
      : [
          RabbitMQModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
              const rabbitUrl =
                configService.get<string>('RABBITMQ_URL') ||
                'amqp://guest:guest@localhost:5672';
              return {
                exchanges: [
                  {
                    name: 'ui_notifications',
                    type: 'fanout',
                  },
                ],
                uri: rabbitUrl,
                connectionInitOptions: { wait: false },
                enableControllerDiscovery: true,
              };
            },
          }),
        ],
  providers:
    process.env.ENABLE_RABBITMQ === 'false'
      ? [EventsGateway]
      : [EventsGateway, NotificationConsumer],
  exports: [EventsGateway],
})
export class EventsModule {}
