import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { EventsGateway } from './events.gateway';
import { NotificationConsumer } from './notification.consumer';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rabbitUrl = configService.get<string>('RABBITMQ_URL');
        if (!rabbitUrl) {
          throw new Error('RABBITMQ_URL is not defined in .env');
        }
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
  providers: [EventsGateway, NotificationConsumer],
  exports: [EventsGateway],
})
export class EventsModule {}
